import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
import {
  IZDataRequestQuery,
  IZPage,
  ZDataRequestBuilder,
} from "@zthun/helpful-query";
import { IZRomulatorSystem } from "./system";
import {
  IZRomulatorPlatformsService,
  ZRomulatorPlatformsToken,
} from "./systems-service.mjs";

@Controller("systems")
export class ZRomulatorSystemsController {
  public constructor(
    @Inject(ZRomulatorPlatformsToken)
    private readonly _systems: IZRomulatorPlatformsService,
  ) {}

  @Get()
  public list(
    @Query() query: IZDataRequestQuery,
  ): Promise<IZPage<IZRomulatorSystem>> {
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
