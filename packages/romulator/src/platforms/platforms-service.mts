import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IZFileSystemNode, IZFileSystemService } from "@zthun/helpful-node";
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
  IZRomulatorConfigService,
  ZRomulatorConfigsToken,
} from "../config/configs-service.mjs";
import { ZFileSystemToken } from "../file/file-system-service.mjs";
import { IZRomulatorPlatform, ZRomulatorPlatformBuilder } from "./platform";

export const ZRomulatorSystemsToken = Symbol("systems");

export interface IZRomulatorSystemsService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorPlatform>>;
  get(id: string): Promise<IZRomulatorPlatform>;
}

@Injectable()
export class ZRomulatorSystemsService implements IZRomulatorSystemsService {
  public constructor(
    @Inject(ZFileSystemToken)
    private readonly _file: IZFileSystemService,
    @Inject(ZRomulatorConfigsToken)
    private readonly _configs: IZRomulatorConfigService,
  ) {}

  public async list(req: IZDataRequest): Promise<IZPage<IZRomulatorPlatform>> {
    const config = await this._configs.read();
    const folders = await this._file.search("*/", { cwd: config.games });

    const systems = folders
      .map((folder) => this.convertToSystem(folder))
      .filter((system) => system != null)
      .map((system) => system as IZRomulatorPlatform);

    const sourceOptions = new ZDataSourceStaticOptionsBuilder()
      .search(new ZDataSearchFields(["id", "name", "short"]))
      .build();

    const source = new ZDataSourceStatic<IZRomulatorPlatform>(
      systems,
      sourceOptions,
    );

    const data = await source.retrieve(req);
    const count = await source.count(req);

    return new ZPageBuilder<IZRomulatorPlatform>()
      .data(data)
      .count(count)
      .build();
  }

  public async get(id: string): Promise<IZRomulatorPlatform> {
    const all = await this.list(new ZDataRequestBuilder().build());
    const system = find(all.data, (system) => system.id === id);

    if (!system) {
      throw new NotFoundException(`Unable to find platform with id, ${id}.`);
    }

    return system;
  }

  private convertToSystem(
    folder: IZFileSystemNode,
  ): IZRomulatorPlatform | null {
    const id = basename(folder.path);
    const builder = new ZRomulatorPlatformBuilder();

    if (typeof builder[id] === "function") {
      return builder[id]().build();
    }

    return null;
  }
}
