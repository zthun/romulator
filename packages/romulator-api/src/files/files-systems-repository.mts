import { Inject, Injectable } from "@nestjs/common";
import { ZStreamFile } from "@zthun/crumbtrail-fs";
import { createError, mib } from "@zthun/helpful-fn";
import {
  ZLogEntryBuilder,
  ZLoggerContext,
  type IZLogger,
} from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import type {
  IZRomulatorSystem,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import { isSystemId, ZRomulatorSystemBuilder } from "@zthun/romulator-client";
import { castArray } from "lodash-es";
import { basename } from "node:path";
import {
  ZRomulatorFilesRepositoryToken,
  type IZRomulatorFilesRepository,
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
  systems(): Promise<IZRomulatorSystem[]>;
}

@Injectable()
export class ZRomulatorFilesSystemsRepository
  implements IZRomulatorFilesSystemsRepository
{
  private _logger: IZLogger;
  private _stream = new ZStreamFile({
    cache: {
      maxFiles: 1,
      fileSize: BigInt(mib(5)),
    },
  });

  /**
   * Initializes a new instance of this object.
   */
  public constructor(
    @Inject(ZRomulatorFilesRepositoryToken)
    private _filesRepository: IZRomulatorFilesRepository,
    @Inject(ZLoggerToken)
    logger: IZLogger,
  ) {
    this._logger = new ZLoggerContext(
      "ZRomulatorFilesSystemsRepository",
      logger,
    );
  }

  private async _read(): Promise<unknown[]> {
    const info = await this._filesRepository.info("systems");

    if (info == null) {
      return [];
    }

    try {
      const contents = await this._stream.read(info.path);
      const json = JSON.parse(contents.toString());
      return castArray<unknown>(json);
    } catch (e) {
      const err = createError(e);
      const msg = `Unable to read ${info.path}: ${err.message}`;
      this._logger.log(new ZLogEntryBuilder().error().message(msg).build());
      return [];
    }
  }

  public async systems(): Promise<IZRomulatorSystem[]> {
    const candidates = await this._read();
    const folders = await this._filesRepository.systems();

    function hasId(candidate: any): candidate is { id: string } {
      return Object.prototype.hasOwnProperty.call(candidate, "id");
    }

    const entries: [ZRomulatorSystemId, unknown][] = candidates
      .filter((c) => hasId(c))
      .filter((c) => isSystemId(c.id))
      .map((c) => [c.id as ZRomulatorSystemId, c as unknown]);

    const lookup = new Map(entries);

    return folders
      .map((folder) => folder.path)
      .map((path) => basename(path))
      .filter((slug) => isSystemId(slug))
      .map((slug) =>
        new ZRomulatorSystemBuilder().parse(lookup.get(slug)).id(slug).build(),
      );
  }
}
