import { Module } from "@nestjs/common";
import { ZFileSystemModule } from "@zthun/crumbtrail-nest";
import { ZLoggerModule } from "@zthun/lumberjacky-nest";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import { ZRomulatorSystemsController } from "./systems-controller.mjs";
import {
  ZRomulatorSystemsService,
  ZRomulatorSystemsToken,
} from "./systems-service.mjs";

@Module({
  imports: [ZRomulatorConfigsModule, ZFileSystemModule, ZLoggerModule],
  controllers: [ZRomulatorSystemsController],
  providers: [
    { provide: ZRomulatorSystemsToken, useClass: ZRomulatorSystemsService },
  ],
})
export class ZRomulatorSystemsModule {}
