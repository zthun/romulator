import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  StreamableFile,
} from "@nestjs/common";
import type { IZFileSystemService } from "@zthun/crumbtrail-fs";
import { ZFileSystemToken } from "@zthun/crumbtrail-nest";
import {
  createError,
  detokenize,
  firstDefined,
  firstTruthy,
} from "@zthun/helpful-fn";
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
  ZRomulatorConfigGamesBuilder,
  ZRomulatorMediaBuilder,
  type IZRomulatorMedia,
} from "@zthun/romulator-client";
import type { IZRestfulDelete, IZRestfulGet } from "@zthun/webigail-rest";
import { ZMimeTypeApplication } from "@zthun/webigail-url";
import { findIndex } from "lodash-es";
import { lookup } from "mime-types";
import { createReadStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { env } from "node:process";
import { ZRomulatorConfigKnown } from "../config/config-known.mjs";
import type { IZRomulatorConfigsService } from "../config/configs-service.mjs";
import { ZRomulatorConfigsToken } from "../config/configs-service.mjs";
import { ZRomulatorSystemKnown } from "../systems/system-known.mjs";

export const ZRomulatorMediaToken = Symbol("romulator-media-service");

export interface IZRomulatorMediaService
  extends IZRestfulGet<IZRomulatorMedia>,
    IZRestfulDelete {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorMedia>>;
  download(id: string, accept: string): Promise<StreamableFile>;
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
    const gamesConfig = ZRomulatorConfigKnown.games();
    const { contents } = await this._config.get(gamesConfig.id);
    const { gamesFolder } = new ZRomulatorConfigGamesBuilder()
      .copy(contents)
      .build();

    const games = detokenize(gamesFolder, env);
    return resolve(games, ".media");
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

  public async list(req: IZDataRequest): Promise<IZPage<IZRomulatorMedia>> {
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

  public async get(id: string): Promise<IZRomulatorMedia> {
    const cwd = await this.getMediaFolder();

    const time = new Date();
    let log = `Searching for media with id ${id}.`;
    this._logger.log(new ZLogEntryBuilder().info().message(log).build());
    const mediaList = await this.findAllMedia(cwd);
    const index = findIndex(mediaList, (m) => m.id === id);
    const span = new Date().getTime() - time.getTime();

    if (index < 0) {
      const msg = `Could not find any media with id, ${id}.`;
      log = `${msg} Search took ${span} milliseconds`;
      this._logger.log(new ZLogEntryBuilder().warning().message(log).build());
      throw new NotFoundException(msg);
    }

    const media = mediaList[index];
    log = `Found media, ${media.url} after ${span} milliseconds`;
    this._logger.log(new ZLogEntryBuilder().info().message(log).build());

    return media;
  }

  public async download(id: string, accept: string): Promise<StreamableFile> {
    let log = `Download request received for ${id}`;
    this._logger.log(new ZLogEntryBuilder().info().message(log).build());
    const fallback = ZMimeTypeApplication.OctetStream;
    const { fileName, url } = await this.get(id);
    const lookupResult = lookup(firstDefined("", fileName));
    const mime = firstTruthy(fallback, lookupResult) as string;
    const accepts = accept.split(",").map((h) => h.split(";")[0].trim());

    const acceptable = accepts.some((a) => {
      if (a === "*/*") {
        return true;
      }
      if (a.endsWith("/*")) {
        return mime.startsWith(a.slice(0, -1));
      }
      return a === mime;
    });

    if (!acceptable) {
      const msg =
        `The media requested is of type ${mime}. ` +
        `The request only accepts ${accept}.`;
      this._logger.log(new ZLogEntryBuilder().error().message(msg).build());
      throw new NotAcceptableException(msg);
    }

    log = `Streaming ${url}`;
    this._logger.log(new ZLogEntryBuilder().info().message(log).build());

    return new StreamableFile(createReadStream(firstDefined("", url)), {
      type: mime,
      disposition: `inline; filename=${fileName}`,
    });
  }

  public async delete(id: string): Promise<void> {
    const { url } = await this.get(id);
    const _url = firstDefined("", url);

    let log = `Attempting to delete file ${_url}`;
    this._logger.log(new ZLogEntryBuilder().info().message(log).build());

    try {
      await unlink(_url);
    } catch (err) {
      const { message } = createError(err);
      this._logger.log(new ZLogEntryBuilder().error().message(message).build());
      throw new ForbiddenException(message);
    }

    log = `Deleted ${url}`;
    this._logger.log(new ZLogEntryBuilder().info().message(log).build());
  }
}
