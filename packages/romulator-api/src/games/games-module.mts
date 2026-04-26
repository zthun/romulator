import { Module } from "@nestjs/common";
import { ZLoggerModule } from "@zthun/lumberjacky-nest";

import { ZRomulatorFilesModule } from "../files/files-module.mjs";
import { ZRomulatorGamesController } from "./games-controller.mjs";
import {
  ZRomulatorGamesService,
  ZRomulatorGamesToken,
} from "./games-service.mjs";

@Module({
  imports: [ZRomulatorFilesModule, ZLoggerModule],
  controllers: [ZRomulatorGamesController],
  providers: [
    {
      provide: ZRomulatorGamesToken,
      useClass: ZRomulatorGamesService,
    },
  ],
})
export class ZRomulatorGamesModule {}
