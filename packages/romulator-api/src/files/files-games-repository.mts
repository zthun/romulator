import { Injectable } from "@nestjs/common";
import type {
  IZRomulatorSystem,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";

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
  games(): Promise<Map<string, IZRomulatorSystem>>;
}

@Injectable()
export class ZRomulatorFilesGamesRepository
  implements IZRomulatorFilesGamesRepository
{
  public async games(): Promise<Map<ZRomulatorSystemId, IZRomulatorSystem>> {
    return new Map();
  }
}
