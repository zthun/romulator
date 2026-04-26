/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";

import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import { ZRomulatorGamesModule } from "../games/games-module.mjs";
import { ZRomulatorJobsModule } from "../jobs/jobs-module.mjs";
import { ZRomulatorMediaModule } from "../media/media-module.mjs";
import { ZRomulatorSystemsModule } from "../systems/systems-module.mjs";

@Module({
  imports: [
    ZRomulatorSystemsModule,
    ZRomulatorConfigsModule,
    ZRomulatorMediaModule,
    ZRomulatorGamesModule,
    ZRomulatorJobsModule,
  ],
})
export class ZRomulatorModule {}
