import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import type { IZDataRequestQuery, IZPage } from "@zthun/helpful-query";
import { ZDataRequestBuilder } from "@zthun/helpful-query";
import type { IZRomulatorSystem } from "@zthun/romulator-client";

import type { IZRomulatorSystemsService } from "./systems-service.mjs";
import { ZRomulatorSystemsToken } from "./systems-service.mjs";

@ApiTags("Systems")
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
    type: "string",
    name: "identification",
    description: "The id of the system",
  })
  @Get(":identification")
  public get(@Param("identification") identification: string) {
    return this._systems.get(identification);
  }
}
