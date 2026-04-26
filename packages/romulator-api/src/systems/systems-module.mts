import { Module } from "@nestjs/common";
import { ZLoggerModule } from "@zthun/lumberjacky-nest";

import { ZRomulatorFilesModule } from "../files/files-module.mjs";
import { ZRomulatorSystemsController } from "./systems-controller.mjs";
import {
  ZRomulatorSystemsService,
  ZRomulatorSystemsToken,
} from "./systems-service.mjs";

@Module({
  imports: [ZRomulatorFilesModule, ZLoggerModule],
  controllers: [ZRomulatorSystemsController],
  providers: [
    {
      provide: ZRomulatorSystemsToken,
      useClass: ZRomulatorSystemsService,
    },
  ],
  exports: [ZRomulatorSystemsToken],
})
export class ZRomulatorSystemsModule {}
