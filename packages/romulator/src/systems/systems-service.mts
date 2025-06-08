import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IZFileSystemService } from "@zthun/crumbtrail-fs";
import { ZFileSystemToken } from "@zthun/crumbtrail-nest";
import type { IZDataRequest, IZPage } from "@zthun/helpful-query";
import {
  ZDataRequestBuilder,
  ZDataSearchFields,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZPageBuilder,
} from "@zthun/helpful-query";
import { find } from "lodash-es";
import { basename } from "node:path";
import type { IZRomulatorConfigGames } from "../config/config-games.mjs";
import { ZRomulatorConfigBuilder } from "../config/config.mjs";
import type { IZRomulatorConfigsService } from "../config/configs-service.mjs";
import { ZRomulatorConfigsToken } from "../config/configs-service.mjs";
import { ZRomulatorSystemKnown } from "./system-known.mjs";
import type { IZRomulatorSystem, ZRomulatorSystemBuilder } from "./system.mjs";

export const ZRomulatorSystemsToken = Symbol("romulator-platforms-service");

export interface IZRomulatorSystemsService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>>;
  get(id: string): Promise<IZRomulatorSystem>;
}

@Injectable()
export class ZRomulatorSystemsService implements IZRomulatorSystemsService {
  public constructor(
    @Inject(ZFileSystemToken)
    private readonly _file: IZFileSystemService,
    @Inject(ZRomulatorConfigsToken)
    private readonly _configs: IZRomulatorConfigsService,
  ) {}

  public async list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>> {
    const games = new ZRomulatorConfigBuilder().games().build();
    const { contents: config } =
      await this._configs.read<IZRomulatorConfigGames>(games.id);
    const folders = await this._file.search("*/", { cwd: config.gamesFolder });

    const systems = folders
      .map((folder) => folder.path)
      .map((path) => basename(path))
      .map((slug) => ZRomulatorSystemKnown.from(slug))
      .filter((system) => system != null)
      .map((system) => system as ZRomulatorSystemBuilder)
      .map((builder) => builder.build());

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
