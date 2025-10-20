import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ZStreamFile } from "@zthun/crumbtrail-fs";
import { createError, firstDefined } from "@zthun/helpful-fn";
import type { IZDataRequest, IZPage } from "@zthun/helpful-query";
import {
  ZDataSearchFields,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZPageBuilder,
} from "@zthun/helpful-query";
import {
  ZLogEntryBuilder,
  ZLoggerContext,
  type IZLogger,
} from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import type { IZRomulatorSystem } from "@zthun/romulator-client";
import {
  isSystemId,
  ZRomulatorSystemBuilder,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import { basename } from "node:path";
import type { IZRomulatorFilesService } from "../files/files-service.mjs";
import { ZRomulatorFilesToken } from "../files/files-service.mjs";

export const ZRomulatorSystemsToken = Symbol("romulator-systems-service");

export interface IZRomulatorSystemsService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>>;
  get(id: string): Promise<IZRomulatorSystem>;
}

@Injectable()
export class ZRomulatorSystemsService implements IZRomulatorSystemsService {
  private _logger: IZLogger;
  private _fileStream = new ZStreamFile({
    cache: { maxFiles: Object.keys(ZRomulatorSystemId).length + 1 },
  });

  public constructor(
    @Inject(ZRomulatorFilesToken)
    private readonly _files: IZRomulatorFilesService,
    @Inject(ZLoggerToken) readonly logger: IZLogger,
  ) {
    this._logger = new ZLoggerContext("ZRomulatorSystemsService", logger);
  }

  public async list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>> {
    const page = firstDefined(1, req.page);
    const size = firstDefined(Infinity, req.size);
    let msg = `Retrieving systems page, ${page}, with size, ${size}.`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const folders = await this._files.systems();

    const systems = await Promise.all(
      folders
        .map((folder) => folder.path)
        .map((path) => basename(path))
        .filter((slug) => isSystemId(slug))
        .map((slug) => this._createSystemFromSlug(slug)),
    );

    msg = `Found ${systems.length} systems`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const sourceOptions = new ZDataSourceStaticOptionsBuilder()
      .search(new ZDataSearchFields(["id", "name", "short"]))
      .build();

    const source = new ZDataSourceStatic<IZRomulatorSystem>(
      systems,
      sourceOptions,
    );

    const data = await source.retrieve(req);
    const count = await source.count(req);

    return new ZPageBuilder().data(data).count(count).build();
  }

  public async get(id: string): Promise<IZRomulatorSystem> {
    // The system path should be the slug itself.
    if (!isSystemId(id)) {
      const message = `The specified system slug, ${id}, is not supported.`;
      throw new NotFoundException(message);
    }

    const node = await this._files.systems(id);

    if (node == null) {
      const message = `System with slug, ${id}, was not found.`;
      throw new NotFoundException(message);
    }

    return this._createSystemFromSlug(id);
  }

  private async _createSystemFromSlug(
    slug: ZRomulatorSystemId,
  ): Promise<IZRomulatorSystem> {
    const system = new ZRomulatorSystemBuilder().id(slug);
    const path = `${slug}/info.json`;
    const info = await this._files.info(path);

    if (info == null) {
      // Best we can do right now.
      return system.build();
    }

    try {
      const contents = await this._fileStream.read(info.path);
      const json = JSON.parse(contents.toString());
      return system.assign(json).redact().build();
    } catch (e) {
      // Best we can do
      const err = createError(e);
      const msg = `Cannot read system metadata, ${err.message}`;
      this._logger.log(new ZLogEntryBuilder().error().message(msg).build());
      return system.build();
    }
  }
}
