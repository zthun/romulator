import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
import {
  IZDataRequestQuery,
  IZPage,
  ZDataRequestBuilder,
} from "@zthun/helpful-query";
import { IZRomulatorPlatform } from "./platform";
import {
  IZRomulatorPlatformsService,
  ZRomulatorPlatformsToken,
} from "./platforms-service.mjs";

@Controller("platforms")
export class ZRomulatorPlatformsController {
  public constructor(
    @Inject(ZRomulatorPlatformsToken)
    private readonly _systems: IZRomulatorPlatformsService,
  ) {}

  @Get()
  public list(
    @Query() query: IZDataRequestQuery,
  ): Promise<IZPage<IZRomulatorPlatform>> {
    return this._systems.list(new ZDataRequestBuilder().query(query).build());
  }

  @ApiParam({
    type: "string | number",
    name: "identification",
    description: "The id of the platform",
  })
  @Get(":identification")
  public get(@Param("identification") identification: string) {
    return this._systems.get(identification);
  }
}
