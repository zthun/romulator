/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import { ZRomulatorFileSystemModule } from "../file/file-system-module.mjs";
import { ZRomulatorPlatformsController } from "./platforms-controller.mjs";
import {
  ZRomulatorPlatformsService,
  ZRomulatorPlatformsToken,
} from "./platforms-service.mjs";

@Module({
  imports: [ZRomulatorConfigsModule, ZRomulatorFileSystemModule],
  controllers: [ZRomulatorPlatformsController],
  providers: [
    { provide: ZRomulatorPlatformsToken, useClass: ZRomulatorPlatformsService },
  ],
})
export class ZRomulatorPlatformsModule {}
