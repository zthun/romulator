import { Inject, Injectable } from "@nestjs/common";
import { IZFileSystemNode, IZFileSystemService } from "@zthun/helpful-node";
import {
  IZDataRequest,
  IZPage,
  ZDataSearchFields,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZPageBuilder,
} from "@zthun/helpful-query";
import {
  IZRomulatorSystem,
  ZRomulatorSystemBuilder,
} from "@zthun/romulator-models";
import { basename } from "node:path";
import {
  IZRomulatorConfigService,
  ZRomulatorConfigsToken,
} from "../config/configs-service.mjs";
import { ZFileSystemToken } from "../file/file-system-service.mjs";

export const ZRomulatorSystemsToken = Symbol("systems");

export interface IZRomulatorSystemsService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>>;
}

@Injectable()
export class ZRomulatorSystemsService implements IZRomulatorSystemsService {
  public constructor(
    @Inject(ZFileSystemToken)
    private readonly _file: IZFileSystemService,
    @Inject(ZRomulatorConfigsToken)
    private readonly _configs: IZRomulatorConfigService,
  ) {}

  public async list(req: IZDataRequest): Promise<IZPage<IZRomulatorSystem>> {
    const config = await this._configs.read();
    const folders = await this._file.search("*/", { cwd: config.games });

    const systems = folders
      .map((folder) => this.convertToSystem(folder))
      .filter((system) => system != null)
      .map((system) => system as IZRomulatorSystem);

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

  private convertToSystem(folder: IZFileSystemNode): IZRomulatorSystem | null {
    const id = basename(folder.path);
    const builder = new ZRomulatorSystemBuilder();

    if (typeof builder[id] === "function") {
      return builder[id]().build();
    }

    return null;
  }
}
