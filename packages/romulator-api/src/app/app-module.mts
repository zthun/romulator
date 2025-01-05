/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZRomulatorSystemsModule } from "../systems/systems-module.mjs";

@Module({
  imports: [ZRomulatorSystemsModule],
})
export class ZRomulatorModule {}
