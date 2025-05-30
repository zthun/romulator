import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { createError } from "@zthun/helpful-fn";
import {
  IZDataRequest,
  IZPage,
  ZDataSearchFields,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZPageBuilder,
} from "@zthun/helpful-query";
import {
  IZLogger,
  ZLogEntryBuilder,
  ZLoggerContext,
} from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import { find } from "lodash-es";
import { readFile } from "node:fs/promises";
import { IZRomulatorConfig, ZRomulatorConfigBuilder } from "./config";

export const ZRomulatorConfigsToken = Symbol("configs");

export interface IZRomulatorConfigsService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorConfig<undefined>>>;
  read<T>(id: string): Promise<Required<IZRomulatorConfig<T>>>;
}

@Injectable()
export class ZRomulatorConfigsService implements IZRomulatorConfigsService {
  private _logger: IZLogger;

  public constructor(@Inject(ZLoggerToken) _logger: IZLogger) {
    this._logger = new ZLoggerContext("ZRomulatorConfigsService", _logger);
  }

  public async list(
    req: IZDataRequest,
  ): Promise<IZPage<IZRomulatorConfig<undefined>>> {
    const configs = ZRomulatorConfigBuilder.all();
    const options = new ZDataSourceStaticOptionsBuilder()
      .search(new ZDataSearchFields())
      .build();
    const source = new ZDataSourceStatic<IZRomulatorConfig>(configs, options);

    const data = await source.retrieve(req);
    const count = await source.count(req);

    return new ZPageBuilder<IZRomulatorConfig>()
      .data(data)
      .count(count)
      .build();
  }

  public async read<T>(id: string): Promise<Required<IZRomulatorConfig<T>>> {
    const configs = ZRomulatorConfigBuilder.all();
    const config = find(configs, (c) => c.id === id);

    if (config == null) {
      const msg = `Could not find config, ${id}`;
      return Promise.reject(new NotFoundException(msg));
    }

    let contents: any = {};

    try {
      const buffer = await readFile(config.file);
      const json = buffer.toString("utf-8");
      contents = JSON.parse(json);
    } catch (e) {
      const entry = new ZLogEntryBuilder()
        .warning()
        .message(createError(e).message)
        .build();
      this._logger.log(entry);
    }

    return Promise.resolve(
      new ZRomulatorConfigBuilder<T>()
        .copy(config)
        .contents(contents)
        .build() as Required<IZRomulatorConfig<T>>,
    );
  }
}
