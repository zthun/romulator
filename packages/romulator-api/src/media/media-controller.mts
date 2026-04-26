import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Query,
  Req,
} from "@nestjs/common";
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  type IZDataRequestQuery,
  ZDataRequestBuilder,
} from "@zthun/helpful-query";
import { ZHttpCodeClient, ZHttpCodeSuccess } from "@zthun/webigail-http";
import type { Request } from "express";

import type { IZRomulatorMediaService } from "./media-service.mjs";
import { ZRomulatorMediaToken } from "./media-service.mjs";

@ApiTags("Media")
@Controller("media")
export class ZRomulatorMediaController {
  public constructor(
    @Inject(ZRomulatorMediaToken)
    private _media: IZRomulatorMediaService,
  ) {}

  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1,
    description: "Page number (1-based)",
  })
  @ApiQuery({
    name: "size",
    required: false,
    type: Number,
    example: 20,
    description: "Items per page.  Defaults to Infinity",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search query",
  })
  @ApiQuery({
    name: "sort",
    required: false,
    type: String,
    description: "Sort criterion",
  })
  @ApiQuery({
    name: "filter",
    required: false,
    type: String,
    description: "Filter criterion",
  })
  @ApiResponse({
    status: ZHttpCodeSuccess.OK,
    description: "Returns the requested page of media and the total count",
  })
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

  @ApiParam({
    type: "string",
    name: "identification",
    description: "The id of the media",
  })
  @Delete(":identification")
  public async delete(@Param("identification") identification: string) {
    await this._media.delete(identification);
  }
}
