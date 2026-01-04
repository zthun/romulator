import { Module } from "@nestjs/common";
import { ZLoggerModule } from "@zthun/lumberjacky-nest";
import { ZRomulatorJobsController } from "./jobs-controller.mjs";
import { ZRomulatorJobsService, ZRomulatorJobsToken } from "./jobs-service.mjs";

@Module({
  imports: [ZLoggerModule],
  controllers: [ZRomulatorJobsController],
  providers: [
    {
      provide: ZRomulatorJobsToken,
      useClass: ZRomulatorJobsService,
    },
  ],
})
export class ZRomulatorJobsModule {}
