import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBody, ApiParam } from "@nestjs/swagger";
import type { IZDataRequestQuery, IZPage } from "@zthun/helpful-query";
import { ZDataRequestBuilder } from "@zthun/helpful-query";
import { type IZRomulatorConfig } from "@zthun/romulator-client";
import { ZRomulatorConfigUpdateDto } from "./config-update.mjs";
import type { IZRomulatorConfigsService } from "./configs-service.mjs";
import { ZRomulatorConfigsToken } from "./configs-service.mjs";

@Controller("configs")
export class ZRomulatorConfigsController {
  public constructor(
    @Inject(ZRomulatorConfigsToken)
    private readonly _configs: IZRomulatorConfigsService,
  ) {}

  @Get()
  public async list(
    @Query() query: IZDataRequestQuery,
  ): Promise<IZPage<IZRomulatorConfig>> {
    const request = new ZDataRequestBuilder().query(query).build();
    return this._configs.list(request);
  }

  @ApiParam({
    type: "string",
    name: "identification",
    description: "The id of the config",
  })
  @ApiBody({
    type: ZRomulatorConfigUpdateDto,
  })
  @Patch(":identification")
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: false,
      skipNullProperties: false,
      skipUndefinedProperties: false,
    }),
  )
  public async update(
    @Param("identification") identification: string,
    @Body() payload: ZRomulatorConfigUpdateDto,
  ): Promise<IZRomulatorConfig> {
    return this._configs.update(identification, payload);
  }

  @ApiParam({
    type: "string",
    name: "identification",
    description: "The id of the config",
  })
  @Get(":identification")
  public async get(
    @Param("identification") identification: string,
  ): Promise<IZRomulatorConfig> {
    return await this._configs.read(identification);
  }
}
