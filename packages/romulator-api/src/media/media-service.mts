import { Inject, Injectable } from "@nestjs/common";
import type { IZFileSystemService } from "@zthun/crumbtrail-fs";
import { ZFileSystemToken } from "@zthun/crumbtrail-nest";
import {
  ZDataSearchFields,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZPageBuilder,
  type IZDataRequest,
  type IZPage,
} from "@zthun/helpful-query";
import {
  ZRomulatorConfigMediaBuilder,
  ZRomulatorMediaBuilder,
  type IZRomulatorMedia,
} from "@zthun/romulator-client";
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
  public constructor(
    @Inject(ZFileSystemToken) private _file: IZFileSystemService,
    @Inject(ZRomulatorConfigsToken) private _config: IZRomulatorConfigsService,
  ) {}

  async list(req: IZDataRequest): Promise<IZPage<IZRomulatorMedia>> {
    const mediaConfig = ZRomulatorConfigKnown.media().build();
    const { contents } = await this._config.get(mediaConfig.id);
    const { mediaFolder } = new ZRomulatorConfigMediaBuilder()
      .copy(contents)
      .build();

    const systems = ZRomulatorSystemKnown.all();
    const glob = `{${systems.map((s) => s.id).join(",")}}/**`;

    const files = await this._file.search(glob, { cwd: mediaFolder });
    const data = files.map((f) =>
      new ZRomulatorMediaBuilder().from(f.path).build(),
    );

    const options = new ZDataSourceStaticOptionsBuilder<IZRomulatorMedia>()
      .search(new ZDataSearchFields())
      .build();
    const source = new ZDataSourceStatic(data, options);
    const page = await source.retrieve(req);
    const count = await source.count(req);

    return new ZPageBuilder<IZRomulatorMedia>().data(page).count(count).build();
  }
}
