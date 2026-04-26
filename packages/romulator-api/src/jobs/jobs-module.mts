import { Inject, Module } from "@nestjs/common";
import { ZLoggerModule } from "@zthun/lumberjacky-nest";

import { ZRomulatorFilesModule } from "../files/files-module.mjs";
import { ZRomulatorJobsController } from "./jobs-controller.mjs";
import type { IZRomulatorJobsRepository } from "./jobs-repository.mjs";
import {
  ZRomulatorJobsRepository,
  ZRomulatorJobsRepositoryToken,
} from "./jobs-repository.mjs";
import { ZRomulatorJobsService, ZRomulatorJobsToken } from "./jobs-service.mjs";

@Module({
  imports: [ZLoggerModule, ZRomulatorFilesModule],
  controllers: [ZRomulatorJobsController],
  providers: [
    {
      provide: ZRomulatorJobsToken,
      useClass: ZRomulatorJobsService,
    },
    {
      provide: ZRomulatorJobsRepositoryToken,
      useClass: ZRomulatorJobsRepository,
    },
  ],
  exports: [ZRomulatorJobsToken],
})
export class ZRomulatorJobsModule {
  public constructor(
    @Inject(ZRomulatorJobsRepositoryToken)
    private _jobs: IZRomulatorJobsRepository,
  ) {}

  public async onModuleInit() {
    await this._jobs.init();
  }
}
