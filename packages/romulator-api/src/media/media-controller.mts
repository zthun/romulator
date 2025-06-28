import { Controller, Get, Inject, Query } from "@nestjs/common";
import {
  ZDataRequestBuilder,
  type IZDataRequestQuery,
} from "@zthun/helpful-query";
import type { IZRomulatorMediaService } from "./media-service.mjs";
import { ZRomulatorMediaToken } from "./media-service.mjs";

@Controller("media")
export class ZRomulatorMediaController {
  public constructor(
    @Inject(ZRomulatorMediaToken)
    private _media: IZRomulatorMediaService,
  ) {}

  @Get()
  public list(@Query() params: IZDataRequestQuery) {
    const request = new ZDataRequestBuilder().query(params).build();
    return this._media.list(request);
  }
}
