/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZFileSystemService } from "@zthun/helpful-node";

export const ZFileSystemToken = Symbol("file-system");

@Module({
  providers: [{ provide: ZFileSystemToken, useClass: ZFileSystemService }],
})
export class ZRomulatorFileSystemModule {}
