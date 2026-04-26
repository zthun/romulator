import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { IZDataRequestQuery, IZPage } from "@zthun/helpful-query";
import { ZDataRequestBuilder } from "@zthun/helpful-query";
import type { IZRomulatorGame } from "@zthun/romulator-client";

import type { IZRomulatorGamesService } from "./games-service.mjs";
import { ZRomulatorGamesToken } from "./games-service.mjs";

@ApiTags("Games")
@Controller("games")
export class ZRomulatorGamesController {
  public constructor(
    @Inject(ZRomulatorGamesToken)
    private readonly _games: IZRomulatorGamesService,
  ) {}

  @Get()
  public list(
    @Query() query: IZDataRequestQuery,
  ): Promise<IZPage<IZRomulatorGame>> {
    return this._games.list(new ZDataRequestBuilder().query(query).build());
  }

  @Get(":identification")
  public get(@Param("identification") identification: string) {
    return this._games.get(identification);
  }
}
