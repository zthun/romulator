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
import { ApiParam } from "@nestjs/swagger";
import {
  IZDataRequestQuery,
  IZPage,
  ZDataRequestBuilder,
} from "@zthun/helpful-query";
import { ZRomulatorConfigUpdateDto } from "./config-update.mjs";
import { IZRomulatorConfig } from "./config.mjs";
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
  public update(
    @Param("identification") id: string,
    @Body() payload: ZRomulatorConfigUpdateDto,
  ): Promise<IZRomulatorConfig> {
    return this._configs.update(id, payload);
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
