import { basename } from "node:path";

import { Inject, Injectable } from "@nestjs/common";
import { firstDefined } from "@zthun/helpful-fn";
import type {
  IZRomulatorSystem,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import { isSystemId, ZRomulatorSystemBuilder } from "@zthun/romulator-client";
import { castArray } from "lodash-es";

import {
  type IZRomulatorFilesRepository,
  ZRomulatorFilesRepositoryToken,
} from "./files-repository.mjs";

export const ZRomulatorFilesSystemsRepositoryToken = Symbol(
  "files-systems-repository",
);

/**
 * A repository responsible for joining IZFileSystemNode objects
 * with the contents of system.json.
 */
export interface IZRomulatorFilesSystemsRepository {
  /**
   * Reads all system entries in the systems.json file and combines
   * them with the existing system list in the games directory
   *
   * @returns
   *        A list of all the systems that are in the games
   *        directory decorated with the content data in systems.json
   *        in the .info directory.
   */
  systems(): Promise<Map<ZRomulatorSystemId, IZRomulatorSystem>>;
}

@Injectable()
export class ZRomulatorFilesSystemsRepository implements IZRomulatorFilesSystemsRepository {
  /**
   * Initializes a new instance of this object.
   */
  public constructor(
    @Inject(ZRomulatorFilesRepositoryToken)
    private _filesRepository: IZRomulatorFilesRepository,
  ) {}

  public async systems(): Promise<Map<ZRomulatorSystemId, IZRomulatorSystem>> {
    const info = await this._filesRepository.info("systems");
    const json = await this._filesRepository.json(info);
    const candidates = castArray(firstDefined([], json));
    const folders = await this._filesRepository.systems();

    function hasId(candidate: any): candidate is { id: string } {
      return Object.prototype.hasOwnProperty.call(candidate, "id");
    }

    const entries: [ZRomulatorSystemId, unknown][] = candidates
      .filter((c) => hasId(c))
      .filter((c) => isSystemId(c.id))
      .map((c) => [c.id as ZRomulatorSystemId, c as unknown]);

    const lookup = new Map(entries);

    const systems = folders
      .map((folder) => folder.path)
      .map((path) => basename(path))
      .filter((slug) => isSystemId(slug))
      .map((slug) =>
        new ZRomulatorSystemBuilder().parse(lookup.get(slug)).id(slug).build(),
      );

    return new Map(systems.map((s) => [s.id, s]));
  }
}
