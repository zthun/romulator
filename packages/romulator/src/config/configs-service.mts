import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { createError, firstDefined } from "@zthun/helpful-fn";
import type { IZDataRequest, IZPage } from "@zthun/helpful-query";
import {
  ZDataSearchFields,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZPageBuilder,
} from "@zthun/helpful-query";
import type { IZLogger } from "@zthun/lumberjacky-log";
import { ZLogEntryBuilder, ZLoggerContext } from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import { find } from "lodash-es";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { ZRomulatorConfigUpdateDto } from "./config-update.mjs";
import { ZRomulatorConfigDto } from "./config.mjs";

export const ZRomulatorConfigsToken = Symbol("configs");

export interface IZRomulatorConfigsService {
  list(req: IZDataRequest): Promise<IZPage<ZRomulatorConfigDto>>;
  find(id: string): Promise<ZRomulatorConfigDto>;
  read<T>(config: ZRomulatorConfigDto): Promise<T>;
  update(
    id: string,
    record: ZRomulatorConfigUpdateDto,
  ): Promise<ZRomulatorConfigDto>;
}

@Injectable()
export class ZRomulatorConfigsService implements IZRomulatorConfigsService {
  private _logger: IZLogger;

  public constructor(@Inject(ZLoggerToken) _logger: IZLogger) {
    this._logger = new ZLoggerContext("ZRomulatorConfigsService", _logger);
  }

  public async list(req: IZDataRequest): Promise<IZPage<ZRomulatorConfigDto>> {
    const page = firstDefined(1, req.page);
    const size = firstDefined(Infinity, req.size);
    let msg = `Retrieving configs page, ${page}, with size, ${size}`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const configs = ZRomulatorConfigDto.all();
    const options = new ZDataSourceStaticOptionsBuilder()
      .search(new ZDataSearchFields())
      .build();
    const source = new ZDataSourceStatic<ZRomulatorConfigDto>(configs, options);

    const data = await source.retrieve(req);
    const count = await source.count(req);

    msg = `Responding with ${data.length} configs out of ${count} total`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    return new ZPageBuilder<ZRomulatorConfigDto>()
      .data(data)
      .count(count)
      .build();
  }

  public async find(id: string): Promise<ZRomulatorConfigDto> {
    let msg = `Attempting to retrieve config, ${id}`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());
    const configs = ZRomulatorConfigDto.all();
    const config = find(configs, (c) => c.id === id);

    if (config == null) {
      msg = `Could not find config, ${id}`;
      this._logger.log(new ZLogEntryBuilder().error().message(msg).build());
      return Promise.reject(new NotFoundException(msg));
    }

    msg = `Config, ${id}, found`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    return config;
  }

  public async read<T>(config: ZRomulatorConfigDto): Promise<T> {
    let msg = `Attempting to read the file contents for config, ${config.id}.`;
    let contents: any = {};

    try {
      this._logger.log(new ZLogEntryBuilder().info().message(msg).build());
      const buffer = await readFile(config.file);
      const json = buffer.toString("utf-8");
      contents = JSON.parse(json);
      msg = `Finished reading config contents (${buffer.byteLength} bytes)`;
      this._logger.log(new ZLogEntryBuilder().info().message(msg).build());
    } catch (e) {
      msg = createError(e).message;
      this._logger.log(new ZLogEntryBuilder().warning().message(msg).build());
    }

    return Promise.resolve(contents);
  }

  public async update<T>(
    id: string,
    record: ZRomulatorConfigUpdateDto,
  ): Promise<ZRomulatorConfigDto> {
    const config = await this.find(id);
    const current = await this.read<T>(config);

    let msg = `Updating config file, ${id}`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const next = { ...current, ...record.contents };
    const json = JSON.stringify(next);

    try {
      await mkdir(dirname(config.file), { recursive: true });
      await writeFile(config.file, json);
      return config;
    } catch (e) {
      const error = createError(e);
      msg = `Unable to write to, ${config.file}`;
      this._logger.log(new ZLogEntryBuilder().error().message(msg).build());
      msg = error.message;
      this._logger.log(new ZLogEntryBuilder().error().message(msg).build());
      return Promise.reject(new InternalServerErrorException(error));
    }
  }
}
