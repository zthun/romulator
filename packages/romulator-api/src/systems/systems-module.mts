/* istanbul ignore file -- @preserve */
import { Module } from "@nestjs/common";
import { ZFileSystemService } from "@zthun/helpful-node";
import { ZFileSystemServiceToken } from "../token/token.mjs";
import { ZRomulatorSystemsController } from "./systems-controller.mjs";
import {
  ZRomulatorSystemsService,
  ZRomulatorSystemsToken,
} from "./systems-service.mjs";

@Module({
  controllers: [ZRomulatorSystemsController],
  providers: [
    { provide: ZRomulatorSystemsToken, useClass: ZRomulatorSystemsService },
    { provide: ZFileSystemServiceToken, useClass: ZFileSystemService },
  ],
})
export class ZRomulatorSystemsModule {}
