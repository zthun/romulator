/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZFileSystemService } from "@zthun/helpful-node";
import { ZFileSystemToken } from "./file-system-service.mjs";

@Module({
  providers: [{ provide: ZFileSystemToken, useClass: ZFileSystemService }],
  exports: [ZFileSystemToken],
})
export class ZRomulatorFileSystemModule {}
