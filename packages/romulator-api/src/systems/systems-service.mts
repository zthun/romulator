import { Inject, Injectable } from "@nestjs/common";
import { IZFileSystemService } from "@zthun/helpful-node";
import { IZPage } from "@zthun/helpful-query";
import { IZRomulatorSystem } from "@zthun/romulator";
import { ZFileSystemServiceToken } from "../token/token.mjs";

export const ZRomulatorSystemsToken = Symbol();

export interface IZRomulatorSystemsService {
  list(): Promise<IZPage<IZRomulatorSystem>>;
}

@Injectable()
export class ZRomulatorSystemsService implements IZRomulatorSystemsService {
  public constructor(
    @Inject(ZFileSystemServiceToken)
    private readonly _file: IZFileSystemService,
  ) {}

  public list(): Promise<IZPage<IZRomulatorSystem>> {
    throw new Error("Method not implemented.");
  }
}
