import { Module } from "@nestjs/common";
import { ZRomulatorMediaController } from "./media-controller.mjs";
import {
  ZRomulatorMediaService,
  ZRomulatorMediaServiceToken,
} from "./media-service.mjs";

@Module({
  controllers: [ZRomulatorMediaController],
  providers: [
    { provide: ZRomulatorMediaServiceToken, useClass: ZRomulatorMediaService },
  ],
})
export class ZRomulatorMediaModule {}
