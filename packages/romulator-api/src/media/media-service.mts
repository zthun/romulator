import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  StreamableFile,
} from "@nestjs/common";
import { createError, firstDefined, firstTruthy } from "@zthun/helpful-fn";
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
  ZRomulatorMediaBuilder,
  type IZRomulatorMedia,
} from "@zthun/romulator-client";
import type { IZRestfulDelete, IZRestfulGet } from "@zthun/webigail-rest";
import { ZMimeTypeImage } from "@zthun/webigail-url";
import { findIndex } from "lodash-es";
import { lookup } from "mime-types";
import { createReadStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { Readable } from "node:stream";
import type { IZRomulatorFilesService } from "../files/files-service.mjs";
import { ZRomulatorFilesToken } from "../files/files-service.mjs";
import type { IZRomulatorMediaGenerator } from "./media-generator.mjs";
import { ZRomulatorMediaGeneratorToken } from "./media-generator.mjs";

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
    @Inject(ZRomulatorMediaGeneratorToken)
    private _generator: IZRomulatorMediaGenerator,
    @Inject(ZRomulatorFilesToken)
    private _files: IZRomulatorFilesService,
    @Inject(ZLoggerToken)
    logger: IZLogger,
  ) {
    this._logger = new ZLoggerContext("ZRomulatorMediaService", logger);
  }

  private async findAllMedia(): Promise<IZRomulatorMedia[]> {
    const files = await this._files.media();

    return files
      .map((f) => new ZRomulatorMediaBuilder().from(f.path).build())
      .filter((media) => !!media.id);
  }

  public async list(req: IZDataRequest): Promise<IZPage<IZRomulatorMedia>> {
    let msg = `Querying media`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());
    const time = new Date();
    const mediaList = await this.findAllMedia();
    const span = new Date().getTime() - time.getTime();
    msg = `Found ${mediaList.length} media files. Search took ${span} milliseconds`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const options = new ZDataSourceStaticOptionsBuilder<IZRomulatorMedia>()
      .search(new ZDataSearchFields())
      .build();
    const source = new ZDataSourceStatic(mediaList, options);
    const page = await source.retrieve(req);
    const count = await source.count(req);

    return new ZPageBuilder<IZRomulatorMedia>().data(page).count(count).build();
  }

  private async query(id: string): Promise<IZRomulatorMedia | null> {
    const mediaList = await this.findAllMedia();
    const index = findIndex(mediaList, (m) => m.id === id);

    return firstDefined(null, mediaList[index]);
  }

  public async get(id: string): Promise<IZRomulatorMedia> {
    const time = new Date();
    let log = `Searching for media with id ${id}.`;
    this._logger.log(new ZLogEntryBuilder().info().message(log).build());
    const media = await this.query(id);

    const span = new Date().getTime() - time.getTime();

    if (media == null) {
      const msg = `Could not find any media with id, ${id}.`;
      log = `${msg} Search took ${span} milliseconds`;
      this._logger.log(new ZLogEntryBuilder().warning().message(log).build());
      throw new NotFoundException(msg);
    }

    log = `Found media, ${media.url} after ${span} milliseconds`;
    this._logger.log(new ZLogEntryBuilder().info().message(log).build());

    return media;
  }

  public async download(id: string, accept: string): Promise<StreamableFile> {
    const log = `Download request received for ${id}`;
    this._logger.log(new ZLogEntryBuilder().info().message(log).build());
    const media = await this.query(id);
    const url = firstDefined("", media?.url);
    const fileName = firstDefined("", media?.fileName);
    const mime: string = firstTruthy(
      ZMimeTypeImage.SVG,
      lookup(fileName),
    ) as string;

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

    const generate = async () => {
      // Note that this isn't perfect and is just a fallback to a wheel + marquee for now.
      // When we get to retrieving other media besides wheels, we will generate
      // everything, but for now, this will be fine enough.
      const log = `Media, ${id}, does not exist.  Generating one`;
      this._logger.log(new ZLogEntryBuilder().warning().message(log).build());

      const parts = id.split("-");
      parts.pop();
      const name = parts.join(" ");
      const buffer = await this._generator.generate(name);

      return Readable.from(buffer);
    };

    const stream = media == null ? await generate() : createReadStream(url);

    return new StreamableFile(stream, {
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
