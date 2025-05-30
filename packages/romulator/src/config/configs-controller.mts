import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
import {
  IZDataRequestQuery,
  IZPage,
  ZDataRequestBuilder,
} from "@zthun/helpful-query";
import { IZRomulatorConfig } from "./config";
import {
  IZRomulatorConfigsService,
  ZRomulatorConfigsToken,
} from "./configs-service.mjs";

@Controller("configs")
export class ZRomulatorConfigsController {
  public constructor(
    @Inject(ZRomulatorConfigsToken)
    private readonly _configs: IZRomulatorConfigsService,
  ) {}

  @Get()
  public list(
    @Query() query: IZDataRequestQuery,
  ): Promise<IZPage<IZRomulatorConfig>> {
    return this._configs.list(new ZDataRequestBuilder().query(query).build());
  }

  @ApiParam({
    type: "string | number",
    name: "identification",
    description: "The id of the config",
  })
  @Get(":identification")
  public get(@Param("identification") id: string): Promise<IZRomulatorConfig> {
    return this._configs.read(id);
  }
}
