/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import { ZRomulatorFileSystemModule } from "../file/file-system-module.mjs";
import { ZRomulatorSystemsController } from "./systems-controller.mjs";
import {
  ZRomulatorPlatformsService,
  ZRomulatorPlatformsToken,
} from "./systems-service.mjs";

@Module({
  imports: [ZRomulatorConfigsModule, ZRomulatorFileSystemModule],
  controllers: [ZRomulatorSystemsController],
  providers: [
    { provide: ZRomulatorPlatformsToken, useClass: ZRomulatorPlatformsService },
  ],
})
export class ZRomulatorSystemsModule {}
