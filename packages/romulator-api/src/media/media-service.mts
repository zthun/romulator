import { Inject, Injectable } from "@nestjs/common";
import type { IZFileSystemService } from "@zthun/crumbtrail-fs";
import { ZFileSystemToken } from "@zthun/crumbtrail-nest";
import { detokenize } from "@zthun/helpful-fn";
import {
  ZDataSearchFields,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZPageBuilder,
  type IZDataRequest,
  type IZPage,
} from "@zthun/helpful-query";
import {
  ZLogEntryBuilder,
  ZLoggerContext,
  type IZLogger,
} from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import {
  ZRomulatorConfigMediaBuilder,
  ZRomulatorMediaBuilder,
  type IZRomulatorMedia,
} from "@zthun/romulator-client";
import { env } from "node:process";
import { ZRomulatorConfigKnown } from "../config/config-known.mjs";
import type { IZRomulatorConfigsService } from "../config/configs-service.mjs";
import { ZRomulatorConfigsToken } from "../config/configs-service.mjs";
import { ZRomulatorSystemKnown } from "../systems/system-known.mjs";

export const ZRomulatorMediaToken = Symbol("romulator-media-service");

export interface IZRomulatorMediaService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorMedia>>;
}

@Injectable()
export class ZRomulatorMediaService implements IZRomulatorMediaService {
  private _logger: IZLogger;

  public constructor(
    @Inject(ZFileSystemToken) private _file: IZFileSystemService,
    @Inject(ZRomulatorConfigsToken) private _config: IZRomulatorConfigsService,
    @Inject(ZLoggerToken) logger: IZLogger,
  ) {
    this._logger = new ZLoggerContext("ZRomulatorMediaService", logger);
  }

  async list(req: IZDataRequest): Promise<IZPage<IZRomulatorMedia>> {
    const mediaConfig = ZRomulatorConfigKnown.media();
    const { contents } = await this._config.get(mediaConfig.id);
    const { mediaFolder } = new ZRomulatorConfigMediaBuilder()
      .copy(contents)
      .build();

    const cwd = detokenize(mediaFolder, env);
    const systems = ZRomulatorSystemKnown.all()
      .map((s) => s.id)
      .join(",");
    const glob = `{${systems}}/**`;

    let msg = `Reading all media from ${cwd}`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());
    const files = await this._file.search(glob, { cwd });
    msg = `Found ${files.length} candidates`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const data = files
      .map((f) => new ZRomulatorMediaBuilder().from(f.path).build())
      .filter((media) => !!media.id);

    msg = `Found ${data.length} actual media files`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const options = new ZDataSourceStaticOptionsBuilder<IZRomulatorMedia>()
      .search(new ZDataSearchFields())
      .build();
    const source = new ZDataSourceStatic(data, options);
    const page = await source.retrieve(req);
    const count = await source.count(req);

    return new ZPageBuilder<IZRomulatorMedia>().data(page).count(count).build();
  }
}
