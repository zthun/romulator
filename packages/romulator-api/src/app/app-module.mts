/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import { ZRomulatorSystemsModule } from "../systems/systems-module.mjs";

@Module({ imports: [ZRomulatorSystemsModule, ZRomulatorConfigsModule] })
export class ZRomulatorModule {}
