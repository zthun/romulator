/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZFileSystemService, ZFileSystemToken } from "@zthun/helpful-node";

@Module({
  providers: [{ provide: ZFileSystemToken, useClass: ZFileSystemService }],
  exports: [ZFileSystemToken],
})
export class ZRomulatorFileSystemModule {}
