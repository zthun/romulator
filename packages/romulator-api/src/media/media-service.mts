import { Inject, Injectable, NotFoundException } from "@nestjs/common";
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
import type { IZRestfulGet } from "@zthun/webigail-rest";
import { findIndex } from "lodash-es";
import { env } from "node:process";
import { ZRomulatorConfigKnown } from "../config/config-known.mjs";
import type { IZRomulatorConfigsService } from "../config/configs-service.mjs";
import { ZRomulatorConfigsToken } from "../config/configs-service.mjs";
import { ZRomulatorSystemKnown } from "../systems/system-known.mjs";

export const ZRomulatorMediaToken = Symbol("romulator-media-service");

export interface IZRomulatorMediaService
  extends IZRestfulGet<IZRomulatorMedia> {
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

  private async getMediaFolder(): Promise<string> {
    const mediaConfig = ZRomulatorConfigKnown.media();
    const { contents } = await this._config.get(mediaConfig.id);
    const { mediaFolder } = new ZRomulatorConfigMediaBuilder()
      .copy(contents)
      .build();

    return detokenize(mediaFolder, env);
  }

  private async findAllMedia(cwd: string): Promise<IZRomulatorMedia[]> {
    const systems = ZRomulatorSystemKnown.all()
      .map((s) => s.id)
      .join(",");
    const glob = `{${systems}}/**`;

    const files = await this._file.search(glob, { cwd, stat: false });

    return files
      .map((f) => new ZRomulatorMediaBuilder().from(f.path).build())
      .filter((media) => !!media.id);
  }

  async list(req: IZDataRequest): Promise<IZPage<IZRomulatorMedia>> {
    const cwd = await this.getMediaFolder();

    let msg = `Reading all media from ${cwd}`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());
    const time = new Date();
    const mediaList = await this.findAllMedia(cwd);
    const span = new Date().getTime() - time.getTime();
    msg = `Found ${mediaList.length} media files. Search took ${span} milliseconds`;

    const options = new ZDataSourceStaticOptionsBuilder<IZRomulatorMedia>()
      .search(new ZDataSearchFields())
      .build();
    const source = new ZDataSourceStatic(mediaList, options);
    const page = await source.retrieve(req);
    const count = await source.count(req);

    return new ZPageBuilder<IZRomulatorMedia>().data(page).count(count).build();
  }

  async get(id: string): Promise<IZRomulatorMedia> {
    const cwd = await this.getMediaFolder();

    const time = new Date();
    let msg = `Searching for media with id ${id}.`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());
    const mediaList = await this.findAllMedia(cwd);
    const index = findIndex(mediaList, (m) => m.id === id);
    const span = new Date().getTime() - time.getTime();

    if (index < 0) {
      const _msg = `Could not find any media with id, ${id}.`;
      msg = `${_msg} Search took ${span} milliseconds`;
      this._logger.log(new ZLogEntryBuilder().warning().message(msg).build());
      throw new NotFoundException(_msg);
    }

    const media = mediaList[index];
    msg = `Found media, ${media.url} after ${span} milliseconds`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    return media;
  }
}
