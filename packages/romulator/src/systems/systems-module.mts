/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import { ZRomulatorFileSystemModule } from "../file/file-system-module.mjs";
import { ZRomulatorSystemsController } from "./systems-controller.mjs";
import {
  ZRomulatorSystemsService,
  ZRomulatorSystemsToken,
} from "./systems-service.mjs";

@Module({
  imports: [ZRomulatorConfigsModule, ZRomulatorFileSystemModule],
  controllers: [ZRomulatorSystemsController],
  providers: [
    { provide: ZRomulatorSystemsToken, useClass: ZRomulatorSystemsService },
  ],
})
export class ZRomulatorSystemsModule {}
