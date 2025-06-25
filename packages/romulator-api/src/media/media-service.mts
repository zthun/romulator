import { Injectable, NotImplementedException } from "@nestjs/common";
import type { IZDataRequest, IZPage } from "@zthun/helpful-query";
import type { IZRomulatorMedia } from "@zthun/romulator-client";

export const ZRomulatorMediaServiceToken = Symbol("romulator-media-service");

export interface IZRomulatorMediaService {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorMedia>>;
}

@Injectable()
export class ZRomulatorMediaService implements IZRomulatorMediaService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  list(_: IZDataRequest): Promise<IZPage<IZRomulatorMedia>> {
    throw new NotImplementedException("Method not yet implemented");
  }
}
