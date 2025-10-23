import { Inject, Injectable } from "@nestjs/common";
import { ZStreamFile } from "@zthun/crumbtrail-fs";
import { createError, mib } from "@zthun/helpful-fn";
import {
  ZLogEntryBuilder,
  ZLoggerContext,
  type IZLogger,
} from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import { isSystemId, type ZRomulatorSystemId } from "@zthun/romulator-client";
import { castArray } from "lodash-es";
import {
  ZRomulatorFilesRepositoryToken,
  type IZRomulatorFilesRepository,
} from "./files-repository.mjs";

export const ZRomulatorFilesSystemsJsonRepositoryToken = Symbol(
  "files-systems-json-repository",
);

/**
 * A repository responsible for reading systems.json from the games info directory.
 */
export interface IZRomulatorFilesSystemsJsonRepository {
  /**
   * Reads all system entries in the systems.json file and returns a mapping.
   *
   * @returns
   *        A mapping of system ids to system entries.  Any corrupted entries
   *        or entries that are not supported will be excluded from this map.
   */
  systems(): Promise<Map<ZRomulatorSystemId, unknown>>;
}

@Injectable()
export class ZRomulatorFilesSystemsJsonRepository
  implements IZRomulatorFilesSystemsJsonRepository
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
    private _files: IZRomulatorFilesRepository,
    @Inject(ZLoggerToken)
    logger: IZLogger,
  ) {
    this._logger = new ZLoggerContext("ZRomulatorSystemsRepository", logger);
  }

  private async _read(): Promise<unknown[]> {
    const info = await this._files.info("systems");

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

  public async systems(): Promise<Map<ZRomulatorSystemId, unknown>> {
    const candidates = await this._read();

    function hasId(candidate: any): candidate is { id: string } {
      return Object.prototype.hasOwnProperty.call(candidate, "id");
    }

    const entries: [ZRomulatorSystemId, unknown][] = candidates
      .filter((c) => hasId(c))
      .filter((c) => isSystemId(c.id))
      .map((c) => [c.id as ZRomulatorSystemId, c as unknown]);

    return Promise.resolve(new Map(entries));
  }
}
