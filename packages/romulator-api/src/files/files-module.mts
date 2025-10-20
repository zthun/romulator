import { Module } from "@nestjs/common";
import { ZFileSystemModule } from "@zthun/crumbtrail-nest";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import {
  ZRomulatorFilesService,
  ZRomulatorFilesToken,
} from "./files-service.mjs";

@Module({
  imports: [ZFileSystemModule, ZRomulatorConfigsModule],
  providers: [
    { provide: ZRomulatorFilesToken, useClass: ZRomulatorFilesService },
  ],
  exports: [ZRomulatorFilesToken],
})
export class ZRomulatorFilesModule {}
