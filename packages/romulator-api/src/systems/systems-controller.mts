import { Controller, Get, Inject } from "@nestjs/common";
import { IZPage } from "@zthun/helpful-query";
import { IZRomulatorSystem } from "@zthun/romulator";
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
  public list(): Promise<IZPage<IZRomulatorSystem>> {
    return this._systems.list();
  }
}
