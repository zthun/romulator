import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { firstDefined } from "@zthun/helpful-fn";
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
import { isSystemId, ZRomulatorSystemBuilder } from "@zthun/romulator-client";
import { basename } from "node:path";
import type { IZRomulatorFilesRepository } from "../files/files-repository.mjs";
import { ZRomulatorFilesToken } from "../files/files-repository.mjs";
import type { IZRomulatorFilesSystemsJsonRepository } from "../files/files-system-json-repository.mjs";
import { ZRomulatorFilesSystemsJsonRepositoryToken } from "../files/files-system-json-repository.mjs";

export const ZRomulatorSystemsToken = Symbol("romulator-systems-service");

export interface IZRomulatorSystemsService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>>;
  get(id: string): Promise<IZRomulatorSystem>;
}

@Injectable()
export class ZRomulatorSystemsService implements IZRomulatorSystemsService {
  private _logger: IZLogger;

  public constructor(
    @Inject(ZRomulatorFilesToken)
    private readonly _filesRepository: IZRomulatorFilesRepository,
    @Inject(ZRomulatorFilesSystemsJsonRepositoryToken)
    private readonly _systemsRepository: IZRomulatorFilesSystemsJsonRepository,
    @Inject(ZLoggerToken)
    readonly logger: IZLogger,
  ) {
    this._logger = new ZLoggerContext("ZRomulatorSystemsService", logger);
  }

  public async list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>> {
    const page = firstDefined(1, req.page);
    const size = firstDefined(Infinity, req.size);
    let msg = `Retrieving systems page, ${page}, with size, ${size}.`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const folders = await this._filesRepository.systems();
    const lookup = await this._systemsRepository.systems();

    const systems = await Promise.all(
      folders
        .map((folder) => folder.path)
        .map((path) => basename(path))
        .filter((slug) => isSystemId(slug))
        .map((slug) =>
          new ZRomulatorSystemBuilder()
            .id(slug)
            .parse(lookup.get(slug))
            .build(),
        ),
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

    const system = await this._filesRepository.systems(id);

    if (system == null) {
      const message = `System with slug, ${id}, was not found.`;
      throw new NotFoundException(message);
    }

    const lookup = await this._systemsRepository.systems();
    const info = lookup.get(id);

    return new ZRomulatorSystemBuilder().id(id).parse(info).build();
  }
}
