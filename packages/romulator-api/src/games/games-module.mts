import { Module } from "@nestjs/common";
import { ZFileSystemModule } from "@zthun/crumbtrail-nest";
import { ZLoggerModule } from "@zthun/lumberjacky-nest";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import { ZRomulatorGamesController } from "./games-controller.mjs";
import {
  ZRomulatorGamesService,
  ZRomulatorGamesToken,
} from "./games-service.mjs";

@Module({
  imports: [ZRomulatorConfigsModule, ZFileSystemModule, ZLoggerModule],
  controllers: [ZRomulatorGamesController],
  providers: [
    {
      provide: ZRomulatorGamesToken,
      useClass: ZRomulatorGamesService,
    },
  ],
})
export class ZRomulatorGamesModule {}
