import { Module } from "@nestjs/common";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import {
  ZRomulatorFilesService,
  ZRomulatorFilesToken,
} from "./files-service.mjs";

@Module({
  imports: [ZRomulatorConfigsModule],
  providers: [
    { provide: ZRomulatorFilesToken, useClass: ZRomulatorFilesService },
  ],
  exports: [ZRomulatorFilesToken],
})
export class ZRomulatorFilesModule {}
