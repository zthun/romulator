import { Module } from "@nestjs/common";
import { ZFileSystemModule } from "@zthun/crumbtrail-nest";
import { ZLoggerModule } from "@zthun/lumberjacky-nest";
import { ZRomulatorConfigsController } from "./configs-controller.mjs";
import {
  ZRomulatorConfigsService,
  ZRomulatorConfigsToken,
} from "./configs-service.mjs";

@Module({
  imports: [ZFileSystemModule, ZLoggerModule],
  controllers: [ZRomulatorConfigsController],
  providers: [
    { provide: ZRomulatorConfigsToken, useClass: ZRomulatorConfigsService },
  ],
  exports: [ZRomulatorConfigsToken],
})
export class ZRomulatorConfigsModule {}
