/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZRomulatorPlatformsModule } from "../platforms/platforms-module.mjs";

@Module({ imports: [ZRomulatorPlatformsModule] })
export class ZRomulatorModule {}
