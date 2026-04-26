import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { firstDefined } from "@zthun/helpful-fn";
import type { IZDataRequest, IZPage } from "@zthun/helpful-query";
import {
  ZDataRequestBuilder,
  ZDataSearchFields,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZFilterBinaryBuilder,
  ZPageBuilder,
} from "@zthun/helpful-query";
import {
  type IZLogger,
  ZLogEntryBuilder,
  ZLoggerContext,
} from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import type { IZRomulatorSystem } from "@zthun/romulator-client";
import { isSystemId } from "@zthun/romulator-client";

import type { IZRomulatorFilesSystemsRepository } from "../files/files-systems-repository.mjs";
import { ZRomulatorFilesSystemsRepositoryToken } from "../files/files-systems-repository.mjs";

export const ZRomulatorSystemsToken = Symbol("romulator-systems-service");

export interface IZRomulatorSystemsService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>>;
  get(id: string): Promise<IZRomulatorSystem>;
}

@Injectable()
export class ZRomulatorSystemsService implements IZRomulatorSystemsService {
  private _logger: IZLogger;

  public constructor(
    @Inject(ZRomulatorFilesSystemsRepositoryToken)
    private readonly _systemsRepository: IZRomulatorFilesSystemsRepository,
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

    const systemMap = await this._systemsRepository.systems();
    const systems = Array.from(systemMap.values());

    msg = `Found ${systems.length} systems`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const sourceOptions = new ZDataSourceStaticOptionsBuilder()
      .search(new ZDataSearchFields(["id", "name"]))
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
    const filter = new ZFilterBinaryBuilder()
      .subject("id")
      .equal()
      .value(id)
      .build();
    const request = new ZDataRequestBuilder().filter(filter).size(1).build();

    const { data: systems } = await this.list(request);
    const [system] = systems;

    if (system == null) {
      const message = `System with slug, ${id}, was not found.`;
      throw new NotFoundException(message);
    }

    return system;
  }
}
