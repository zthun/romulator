/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import { ZRomulatorFileSystemModule } from "../file/file-system-module.mjs";
import { ZRomulatorPlatformsController } from "./platforms-controller.mjs";
import {
  ZRomulatorSystemsService,
  ZRomulatorSystemsToken,
} from "./platforms-service.mjs";

@Module({
  imports: [ZRomulatorConfigsModule, ZRomulatorFileSystemModule],
  controllers: [ZRomulatorPlatformsController],
  providers: [
    { provide: ZRomulatorSystemsToken, useClass: ZRomulatorSystemsService },
  ],
})
export class ZRomulatorSystemsModule {}
