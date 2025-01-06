import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
import {
  IZDataRequestQuery,
  IZPage,
  ZDataRequestBuilder,
} from "@zthun/helpful-query";
import { IZRomulatorSystem } from "@zthun/romulator-models";
import {
  IZRomulatorSystemsService,
  ZRomulatorSystemsToken,
} from "./systems-service.mjs";

@Controller("systems")
export class ZRomulatorSystemsController {
  public constructor(
    @Inject(ZRomulatorSystemsToken)
    private readonly _systems: IZRomulatorSystemsService,
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
    description: "The id of the system",
  })
  @Get(":identification")
  public get(@Param("identification") identification: string) {
    return this._systems.get(identification);
  }
}
