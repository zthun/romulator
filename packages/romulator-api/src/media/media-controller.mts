import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
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

  @ApiParam({
    type: "string",
    name: "identification",
    description: "The id of the media",
  })
  @Get(":identification")
  public get(@Param("identification") identification: string) {
    return this._media.get(identification);
  }
}
