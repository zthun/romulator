import { Controller, Get, Inject, Param, Query, Req } from "@nestjs/common";
import { ApiParam, ApiResponse } from "@nestjs/swagger";
import {
  ZDataRequestBuilder,
  type IZDataRequestQuery,
} from "@zthun/helpful-query";
import { ZHttpCodeClient, ZHttpCodeSuccess } from "@zthun/webigail-http";
import type { Request } from "express";
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
  @ApiResponse({
    status: ZHttpCodeSuccess.OK,
    description: "Returns the media",
    content: {
      "*/*": {},
      "image/*": {},
      "image/png": {},
      "image/jpeg": {},
      "application/mp4": {},
      "application/json": {},
    },
  })
  @ApiResponse({
    status: ZHttpCodeClient.NotFound,
    description: "Media not found",
  })
  @ApiResponse({
    status: ZHttpCodeClient.NotAcceptable,
    description: "Unsupported Accept header",
  })
  @Get(":identification")
  public async get(
    @Param("identification") identification: string,
    @Req() req: Request,
  ) {
    const { accept = "*/*" } = req.headers;

    return accept.includes("application/json")
      ? this._media.get(identification)
      : this._media.download(identification, accept);
  }
}
