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
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { IZRomulatorConfig, ZRomulatorConfigBuilder } from "./config.mjs";

export const ZRomulatorConfigsToken = Symbol("configs");

export interface IZRomulatorConfigsService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorConfig<undefined>>>;
  read<T>(id: string): Promise<Required<IZRomulatorConfig<T>>>;
  update<T>(
    id: string,
    record: Partial<IZRomulatorConfig<T>>,
  ): Promise<IZRomulatorConfig<T>>;
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

  public async find(id: string): Promise<IZRomulatorConfig<undefined>> {
    const configs = ZRomulatorConfigBuilder.all();
    const config = find(configs, (c) => c.id === id);

    if (config == null) {
      const msg = `Could not find config, ${id}`;
      return Promise.reject(new NotFoundException(msg));
    }

    return config;
  }

  public async read<T>(id: string): Promise<Required<IZRomulatorConfig<T>>> {
    const config = await this.find(id);

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
      new ZRomulatorConfigBuilder<undefined>()
        .copy(config)
        .contents(contents)
        .cast<T>()
        .build() as Required<IZRomulatorConfig<T>>,
    );
  }

  public async update<T>(
    id: string,
    record: Partial<IZRomulatorConfig<T>>,
  ): Promise<IZRomulatorConfig<T>> {
    const current = await this.read<T>(id);

    const next = new ZRomulatorConfigBuilder<T>()
      .copy(current)
      .assign(record)
      .build();
    const json = JSON.stringify(next.contents);

    await mkdir(dirname(next.file), { recursive: true });
    await writeFile(next.file, json);

    return next;
  }
}
