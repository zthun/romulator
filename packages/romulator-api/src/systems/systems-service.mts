import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IZFileSystemService } from "@zthun/crumbtrail-fs";
import { ZFileSystemToken } from "@zthun/crumbtrail-nest";
import { detokenize, firstDefined } from "@zthun/helpful-fn";
import type { IZDataRequest, IZPage } from "@zthun/helpful-query";
import {
  ZDataRequestBuilder,
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
  ZRomulatorConfigGamesMetadata,
  ZRomulatorConfigId,
} from "@zthun/romulator-client";
import { find } from "lodash-es";
import { basename } from "node:path";
import type { IZRomulatorConfigsService } from "../config/configs-service.mjs";
import { ZRomulatorConfigsToken } from "../config/configs-service.mjs";
import { ZRomulatorSystemKnown } from "./system-known.mjs";

export const ZRomulatorSystemsToken = Symbol("romulator-systems-service");

export interface IZRomulatorSystemsService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>>;
  get(id: string): Promise<IZRomulatorSystem>;
}

@Injectable()
export class ZRomulatorSystemsService implements IZRomulatorSystemsService {
  private _logger: IZLogger;

  public constructor(
    @Inject(ZFileSystemToken)
    private readonly _file: IZFileSystemService,
    @Inject(ZRomulatorConfigsToken)
    private readonly _configs: IZRomulatorConfigsService,
    @Inject(ZLoggerToken) readonly logger: IZLogger,
  ) {
    this._logger = new ZLoggerContext("ZRomulatorSystemsService", logger);
  }

  public async list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>> {
    const page = firstDefined(1, req.page);
    const size = firstDefined(Infinity, req.size);
    let msg = `Retrieving systems page, ${page}, with size, ${size}.`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const { contents } = await this._configs.get(ZRomulatorConfigId.Games);
    const { gamesFolder } = contents;
    const { fallback } = ZRomulatorConfigGamesMetadata.gamesFolder();
    const _folder = firstDefined(fallback, gamesFolder);

    const cwd = detokenize(_folder, process.env);
    msg = `Looking for systems in ${cwd}`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());
    const searchOptions = { cwd };
    const folders = await this._file.search("*/", searchOptions);

    const systems = folders
      .map((folder) => folder.path)
      .map((path) => basename(path))
      .map((slug) => ZRomulatorSystemKnown.from(slug))
      .filter((system) => system != null)
      .map((system) => system.build());

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

    return new ZPageBuilder<IZRomulatorSystem>()
      .data(data)
      .count(count)
      .build();
  }

  public async get(id: string): Promise<IZRomulatorSystem> {
    const all = await this.list(new ZDataRequestBuilder().build());
    const system = find(all.data, (system) => system.id === id);

    if (!system) {
      throw new NotFoundException(`Unable to find system with id, ${id}.`);
    }

    return system;
  }
}
