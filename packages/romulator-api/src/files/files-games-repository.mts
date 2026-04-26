import { Inject, Injectable } from "@nestjs/common";
import { ZFileSystemNodeBuilder } from "@zthun/crumbtrail-fs";
import type {
  IZRomulatorGame,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import { isSystemId, ZRomulatorGameBuilder } from "@zthun/romulator-client";
import { castArray, get, kebabCase, uniq } from "lodash-es";
import { resolve } from "path";

import type { IZRomulatorFilesRepository } from "./files-repository.mjs";
import { ZRomulatorFilesRepositoryToken } from "./files-repository.mjs";
import type { IZRomulatorFilesSystemsRepository } from "./files-systems-repository.mjs";
import { ZRomulatorFilesSystemsRepositoryToken } from "./files-systems-repository.mjs";

export const ZRomulatorFilesGamesRepositoryToken = Symbol(
  "files-games-repository",
);

/**
 * A repository responsible for joining IZFileSystemNode objects
 * with the contents of a game list json file.
 */
export interface IZRomulatorFilesGamesRepository {
  /**
   * Reads all of the games in the games directory.
   *
   * Game targets are determined by the extensions in system.json.
   *
   * @returns
   *        A list of all the games that are in the games
   *        directory decorated with the content data in the matching
   *        system json file in the .info directory.
   */
  games(): Promise<Map<string, IZRomulatorGame>>;
}

@Injectable()
export class ZRomulatorFilesGamesRepository implements IZRomulatorFilesGamesRepository {
  public constructor(
    @Inject(ZRomulatorFilesSystemsRepositoryToken)
    private readonly _systemsRepository: IZRomulatorFilesSystemsRepository,
    @Inject(ZRomulatorFilesRepositoryToken)
    private readonly _filesRepository: IZRomulatorFilesRepository,
  ) {}

  public async games(): Promise<Map<string, IZRomulatorGame>> {
    function hasPath(entry: unknown): entry is { path: string } {
      return typeof get(entry, "path") === "string";
    }

    const gamesFolder = await this._filesRepository.gamesFolder();
    const games: IZRomulatorGame[] = [];
    const systemLookup = await this._systemsRepository.systems();
    const systems = Array.from(systemLookup.values());
    const gameFiles = await this._filesRepository.games(systems);
    const systemsInUse = uniq(gameFiles.map((g) => g.parent))
      .map((dir) => new ZFileSystemNodeBuilder().path(dir).folder().build())
      .map((node) => node.title)
      .filter((title) => isSystemId(title));

    const gameInfo = new Map<string, unknown>();

    for await (const system of systemsInUse) {
      const info = await this._filesRepository.info(system);
      const json = await this._filesRepository.json(info);
      const gameList = castArray(json).filter((e) => hasPath(e));
      gameList.forEach((entry) => {
        gameInfo.set(resolve(gamesFolder, system, entry.path), entry);
      });
    }

    // Variable, gameInfo, now has all of the information data that we need.
    for (const file of gameFiles) {
      const { title, path } = file;
      const { title: systemId } = new ZFileSystemNodeBuilder()
        .path(file.parent)
        .folder()
        .build();
      const id = `${kebabCase(systemId)}-${kebabCase(title)}`;
      const info = gameInfo.get(path);

      const game = new ZRomulatorGameBuilder()
        .id(id)
        .system(systemId as ZRomulatorSystemId)
        .file(path)
        .parse(info)
        .build();

      games.push(game);
    }

    return new Map(games.map((g) => [g.id, g]));
  }
}
