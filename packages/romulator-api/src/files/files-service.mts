import { Inject, Injectable } from "@nestjs/common";
import type {
  IZFileRepository,
  IZFileSystemNode,
  IZFileSystemService,
} from "@zthun/crumbtrail-fs";
import {
  ZFileRepository,
  ZStreamFile,
  ZStreamFolder,
} from "@zthun/crumbtrail-fs";
import { ZFileSystemToken } from "@zthun/crumbtrail-nest";
import { detokenize, firstDefined } from "@zthun/helpful-fn";
import {
  ZDataRequestBuilder,
  ZFilterBinaryBuilder,
  ZFilterLogicBuilder,
  ZSortBuilder,
} from "@zthun/helpful-query";
import {
  ZRomulatorConfigGamesBuilder,
  ZRomulatorConfigGamesMetadata,
  ZRomulatorConfigId,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import { castArray, first, trimEnd } from "lodash-es";
import { resolve } from "node:path";
import { env } from "node:process";
import type { IZRomulatorConfigsService } from "../config/configs-service.mjs";
import { ZRomulatorConfigsToken } from "../config/configs-service.mjs";

export const ZRomulatorFilesToken = Symbol("files");

/**
 * Represents the service that you can use to
 * scan the games folder for media, info, games, and systems.
 */
export interface IZRomulatorFilesService {
  /**
   * Retrieves all media found in the games .media folder.
   *
   * @returns
   *        A list of all media found in the game media folder.
   */
  media(): Promise<IZFileSystemNode[]>;

  /**
   * Retrieves a single media node found in the .media folder.
   *
   * @param path -
   *        The path of the media node to retrieve.  This will
   *        be relative to the configured games directory.  If this
   *        starts with a root OS folder, then the path by itself
   *        is used.
   *
   * @returns
   *        The node with the given path or null if no such
   *        file exists.
   */
  media(path: string): Promise<IZFileSystemNode | null>;

  /**
   * Retrieves all systems found in the games folder.
   *
   * A system is a root folder that is a slug of a supported
   * system.
   *
   * @returns
   *        A list of all systems found in the games folder.
   */
  systems(): Promise<IZFileSystemNode[]>;

  /**
   * Retrieves a single system found in the games folder.
   *
   * @param path -
   *        The id of the system, which is also the name of the folder.
   *
   * @returns
   *        The node that represents the system slug.  Returns null if
   *        the folder does not exist or is not supported.  Note
   *        that the path is relative to the configured games folder. If you
   *        want to supply a fully qualified absolute path, then this string
   *        should start with the root of an OS drive (not recommended).
   */
  systems(path: string): Promise<IZFileSystemNode | null>;

  /**
   * Retrieves all info found in the games .info folder.
   *
   * Info is the metadata scraped from a scraper service.
   * The data format is stored in json.
   *
   * @returns
   *        A list of all info found in the games folder.
   */
  info(): Promise<IZFileSystemNode[]>;

  /**
   * Retrieves specific information found in the games .info folder.
   *
   * @param path -
   *        The path of the info node to retrieve.
   *
   * @returns
   *        The node with the given path or null if no such file exists.
   */
  info(path: string): Promise<IZFileSystemNode | null>;

  /**
   * Gets the contents of the file.
   *
   * @param info -
   *        The file to read and store.
   *
   * @returns
   *        The buffer of data that the file contained.
   */
  read(info: IZFileSystemNode): Promise<Buffer>;

  /**
   * Initializes the file repository.
   */
  init(): Promise<void>;

  /**
   * Cleans up internal resources.
   */
  dispose(): Promise<void>;
}

@Injectable()
export class ZRomulatorFilesService implements IZRomulatorFilesService {
  private static readonly MediaFolderName = ".media";
  private static readonly InfoFolderName = ".info";

  private _repository: ZFileRepository = new ZFileRepository();
  private _folderStream = new ZStreamFolder();
  private _fileStream = new ZStreamFile();
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
    return resolve(gamesFolder, ZRomulatorFilesService.MediaFolderName);
  }

  private async infoFolder() {
    const gamesFolder = await this.gamesFolder();
    return resolve(gamesFolder, ZRomulatorFilesService.InfoFolderName);
  }

  private async contents(
    roots: string | string[],
    path?: string,
  ): Promise<IZFileSystemNode[] | IZFileSystemNode | null> {
    const repository = await this.seed();
    const folders = castArray(roots).map((root) => `${trimEnd(root, "/")}/`);

    const byPaths = folders.map((folder) => {
      const byPath = new ZFilterBinaryBuilder().subject("path");
      const pathFilter =
        path == null
          ? byPath.startsWith().value(folder)
          : byPath.equal().value(resolve(folder, path));
      return pathFilter.build();
    });

    const filter =
      byPaths.length > 1
        ? new ZFilterLogicBuilder().or().clauses(byPaths).build()
        : first(byPaths)!;

    const sort = new ZSortBuilder().ascending("path").build();
    const request = new ZDataRequestBuilder().filter(filter).sort(sort).build();
    const nodes = await repository.retrieve(request);

    return path == null ? nodes : firstDefined(null, first(nodes));
  }

  public async init() {
    await this.seed();
  }

  public async dispose() {
    await this._repository.reset();
  }

  public async seed(): Promise<IZFileRepository> {
    const path = await this.gamesFolder();

    if (this._repository.path !== path) {
      await this._folderStream.write(await this.mediaFolder());
      await this._folderStream.write(await this.infoFolder());
      await this._repository.initialize(path, this._globs);
    }

    return this._repository;
  }

  public media(): Promise<IZFileSystemNode[]>;
  public media(path: string): Promise<IZFileSystemNode | null>;
  public async media(path?: string) {
    return this.contents(await this.mediaFolder(), path);
  }

  public systems(): Promise<IZFileSystemNode[]>;
  public systems(path: string): Promise<IZFileSystemNode | null>;
  public async systems(path?: string) {
    // Systems use directories.  There's a maximum limit of about 200 systems.
    // Since we don't actually need to read any metadata or scan through thousands
    // of unknown folders, we can use the supported system ids to just grab the
    // systems that we need.  Since the file repository does a stat anyway, we can just
    // grab the systems from the file system and it should be fast enough.  These are all
    // folders, so we don't even need the stats for them and we can assume folders.
    const games = await this.gamesFolder();
    const folders =
      path == null ? this._systems.map((s) => `${s}/`) : resolve(games, path);
    const items = await this._fileSystem.search(folders, {
      cwd: games,
      stat: false,
    });

    return path == null ? items : firstDefined(null, first(items));
  }

  public info(): Promise<IZFileSystemNode[]>;
  public info(path: string): Promise<IZFileSystemNode | null>;
  public async info(path?: string) {
    return this.contents(await this.infoFolder(), path);
  }

  public games(): Promise<IZFileSystemNode[]>;
  public games(path: string): Promise<IZFileSystemNode | null>;
  public async games(path?: string) {
    const root = await this.gamesFolder();

    return this.contents(
      this._systems.map((s) => resolve(root, s)),
      path,
    );
  }

  public read(node: IZFileSystemNode): Promise<Buffer> {
    return this._fileStream.read(node.path);
  }
}
