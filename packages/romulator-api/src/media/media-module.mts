import { Module } from "@nestjs/common";
import { ZRomulatorMediaController } from "./media-controller.mjs";

@Module({
  controllers: [ZRomulatorMediaController],
})
export class ZRomulatorMediaModule {}
