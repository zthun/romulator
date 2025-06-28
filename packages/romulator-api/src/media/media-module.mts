import { Module } from "@nestjs/common";
import { ZFileSystemModule } from "@zthun/crumbtrail-nest";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import { ZRomulatorMediaController } from "./media-controller.mjs";
import {
  ZRomulatorMediaService,
  ZRomulatorMediaToken,
} from "./media-service.mjs";

@Module({
  imports: [ZFileSystemModule, ZRomulatorConfigsModule],
  controllers: [ZRomulatorMediaController],
  providers: [
    { provide: ZRomulatorMediaToken, useClass: ZRomulatorMediaService },
  ],
})
export class ZRomulatorMediaModule {}
