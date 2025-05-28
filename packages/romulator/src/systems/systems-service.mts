import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IZFileSystemService } from "@zthun/helpful-node";
import {
  IZDataRequest,
  IZPage,
  ZDataRequestBuilder,
  ZDataSearchFields,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZPageBuilder,
} from "@zthun/helpful-query";
import { find } from "lodash-es";
import { basename } from "node:path";
import {
  IZRomulatorConfigsService,
  ZRomulatorConfigsToken,
} from "../config/configs-service.mjs";
import { ZFileSystemToken } from "../file/file-system-service.mjs";
import { IZRomulatorSystem, ZRomulatorSystemBuilder } from "./system";
import { ZRomulatorSystemKnown } from "./system-known";

export const ZRomulatorPlatformsToken = Symbol("romulator-platforms-service");

export interface IZRomulatorPlatformsService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>>;
  get(id: string): Promise<IZRomulatorSystem>;
}

@Injectable()
export class ZRomulatorPlatformsService implements IZRomulatorPlatformsService {
  public constructor(
    @Inject(ZFileSystemToken)
    private readonly _file: IZFileSystemService,
    @Inject(ZRomulatorConfigsToken)
    private readonly _configs: IZRomulatorConfigsService,
  ) {}

  public async list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>> {
    const config = await this._configs.read();
    const folders = await this._file.search("*/", { cwd: config.games });

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
      throw new NotFoundException(`Unable to find platform with id, ${id}.`);
    }

    return system;
  }
}
