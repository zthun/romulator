import { Inject, Injectable } from "@nestjs/common";
import type {
  IZFileRepository,
  IZFileSystemNode,
  IZFileSystemService,
} from "@zthun/crumbtrail-fs";
import { ZFileRepository, ZStreamFolder } from "@zthun/crumbtrail-fs";
import { ZFileSystemToken } from "@zthun/crumbtrail-nest";
import { detokenize, firstDefined } from "@zthun/helpful-fn";
import {
  ZDataRequestBuilder,
  ZFilterBinaryBuilder,
  ZFilterCollectionBuilder,
  ZFilterLogicBuilder,
  ZSortBuilder,
} from "@zthun/helpful-query";
import type { IZRomulatorSystem } from "@zthun/romulator-client";
import {
  ZRomulatorConfigGamesBuilder,
  ZRomulatorConfigGamesMetadata,
  ZRomulatorConfigId,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import { flatten, trimStart } from "lodash-es";
import { resolve } from "node:path";
import { env } from "node:process";
import type { IZRomulatorConfigsService } from "../config/configs-service.mjs";
import { ZRomulatorConfigsToken } from "../config/configs-service.mjs";

export const ZRomulatorFilesRepositoryToken = Symbol("files-repository");

/**
 * Represents the repository that you can use to
 * scan the games folder for media, info, games, and systems.
 */
export interface IZRomulatorFilesRepository {
  /**
   * Retrieves all media found in the games .media folder.
   *
   * @returns
   *        A list of all media found in the game media folder.
   */
  media(): Promise<IZFileSystemNode[]>;

  /**
   * Retrieves all systems found in the games folder.
   *
   * A system is a root folder that is a slug of a supported
   * system.
   *
   * @returns
   *        A list of all system folders found in the games folder.
   */
  systems(): Promise<IZFileSystemNode[]>;

  /**
   * Retrieves all games for the given systems list.
   *
   * @param systems -
   *        The list of systems to query games by.
   *
   * @returns
   *        A list of file system nodes that represent a game
   *        in the system directory.
   */
  games(systems: IZRomulatorSystem[]): Promise<IZFileSystemNode[]>;

  /**
   * Retrieves the file that represents the systems info or games info
   * for a given system.
   *
   * @param id -
   *        Which info item you want to receive - the root system information
   *        or the information for a given game list for an individual system.
   *
   * @returns
   *        The node that represents the info json, or null if no such file
   *        exists.
   */
  info(id: "systems" | ZRomulatorSystemId): Promise<IZFileSystemNode | null>;

  /**
   * Initializes the file repository.
   */
  init(): Promise<any>;

  /**
   * Cleans up internal resources.
   */
  dispose(): Promise<void>;
}

@Injectable()
export class ZRomulatorFilesRepository implements IZRomulatorFilesRepository {
  private static readonly MediaFolderName = ".media";
  private static readonly InfoFolderName = ".info";

  private _repository: ZFileRepository = new ZFileRepository();
  private _folderStream = new ZStreamFolder();
  private _globs: string[];
  private _systems: string[];

  public constructor(
    @Inject(ZRomulatorConfigsToken)
    private readonly _configs: IZRomulatorConfigsService,
    @Inject(ZFileSystemToken)
    private readonly _fileSystem: IZFileSystemService,
  ) {
    const slugs = Object.values(ZRomulatorSystemId);
    this._globs = [".media/**", ".info/**", ...slugs.map((s) => `${s}/*.*`)];
    this._systems = Object.values(ZRomulatorSystemId);
  }

  private async gamesFolder() {
    const config = await this._configs.get(ZRomulatorConfigId.Games);
    const { gamesFolder } = new ZRomulatorConfigGamesBuilder()
      .copy(config.contents)
      .build();
    const { fallback } = ZRomulatorConfigGamesMetadata.gamesFolder();
    const _gamesFolder = firstDefined(fallback.gamesFolder, gamesFolder);
    return detokenize(_gamesFolder, env);
  }

  private async mediaFolder() {
    const gamesFolder = await this.gamesFolder();
    return resolve(gamesFolder, ZRomulatorFilesRepository.MediaFolderName);
  }

  private async infoFolder() {
    const gamesFolder = await this.gamesFolder();
    return resolve(gamesFolder, ZRomulatorFilesRepository.InfoFolderName);
  }

  public async dispose() {
    await this._repository.reset();
  }

  public async init(): Promise<IZFileRepository> {
    const path = await this.gamesFolder();

    if (this._repository.path !== path) {
      await this._folderStream.write(await this.mediaFolder());
      await this._folderStream.write(await this.infoFolder());
      await this._repository.initialize(path, this._globs);
    }

    return this._repository;
  }

  public async media() {
    const repository = await this.init();
    const folder = `${await this.mediaFolder()}/`;
    const request = new ZDataRequestBuilder()
      .filter(
        new ZFilterBinaryBuilder()
          .subject("path")
          .startsWith()
          .value(folder)
          .build(),
      )
      .sort(new ZSortBuilder().ascending("path").build())
      .build();

    return repository.retrieve(request);
  }

  public async info(id?: "systems" | ZRomulatorSystemId) {
    // The info json files are json files that contain arrays of games grouped by systems,
    // or systems.json which describes system information.
    const folder = await this.infoFolder();
    const path = resolve(folder, `${id}.json`);

    return this._repository.get(path);
  }

  public async systems() {
    // Systems use directories.  There's a maximum limit of about 200 systems.
    // Since we don't actually need to read any metadata or scan through thousands
    // of unknown folders, we can use the supported system ids to just grab the
    // systems that we need.  Since the file repository does a stat anyway, we can just
    // grab the systems from the file system and it should be fast enough.  These are all
    // folders, so we don't even need the stats for them and we can assume folders.
    const games = await this.gamesFolder();
    const folders = this._systems.map((s) => `${s}/`);
    return await this._fileSystem.search(folders, {
      cwd: games,
      stat: false,
    });
  }

  public async games(systems: IZRomulatorSystem[]) {
    const repository = await this.init();
    const folder = await this.gamesFolder();

    const queries = systems.map((s) => {
      const dir = `${folder}/${s.id}`;

      const byExtension = new ZFilterCollectionBuilder()
        .subject("extension")
        .in()
        .values(s.extensions.map((e) => `.${trimStart(e, ".")}`))
        .build();
      const inPath = new ZFilterBinaryBuilder()
        .subject("parent")
        .equal()
        .value(dir)
        .build();
      const filter = new ZFilterLogicBuilder()
        .and()
        .clause(inPath)
        .clause(byExtension)
        .build();
      const request = new ZDataRequestBuilder().filter(filter).build();
      return repository.retrieve(request);
    });

    const results = await Promise.all(queries);

    return flatten(results);
  }
}
