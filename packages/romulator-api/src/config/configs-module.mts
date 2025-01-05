import { Module } from "@nestjs/common";
import {
  ZRomulatorConfigService,
  ZRomulatorConfigsToken,
} from "./configs-service.mjs";

@Module({
  providers: [
    { provide: ZRomulatorConfigsToken, useClass: ZRomulatorConfigService },
  ],
  exports: [ZRomulatorConfigsToken],
})
export class ZRomulatorConfigsModule {}
