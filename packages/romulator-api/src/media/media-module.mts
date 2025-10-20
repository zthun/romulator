import { Module } from "@nestjs/common";
import { ZLoggerModule } from "@zthun/lumberjacky-nest";
import { ZRomulatorFilesModule } from "../files/files-module.mjs";
import { ZRomulatorMediaController } from "./media-controller.mjs";
import {
  ZRomulatorMediaService,
  ZRomulatorMediaToken,
} from "./media-service.mjs";

@Module({
  imports: [ZLoggerModule, ZRomulatorFilesModule],
  controllers: [ZRomulatorMediaController],
  providers: [
    { provide: ZRomulatorMediaToken, useClass: ZRomulatorMediaService },
  ],
})
export class ZRomulatorMediaModule {}
