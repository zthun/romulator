import { Inject, Module } from "@nestjs/common";
import { ZFileSystemModule } from "@zthun/crumbtrail-nest";
import { ZLoggerModule } from "@zthun/lumberjacky-nest";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import {
  ZRomulatorFilesGamesRepository,
  ZRomulatorFilesGamesRepositoryToken,
} from "./files-games-repository.mjs";
import type { IZRomulatorFilesRepository } from "./files-repository.mjs";
import {
  ZRomulatorFilesRepository,
  ZRomulatorFilesRepositoryToken,
} from "./files-repository.mjs";
import {
  ZRomulatorFilesSystemsRepository,
  ZRomulatorFilesSystemsRepositoryToken,
} from "./files-systems-repository.mjs";

@Module({
  imports: [ZFileSystemModule, ZRomulatorConfigsModule, ZLoggerModule],
  providers: [
    {
      provide: ZRomulatorFilesRepositoryToken,
      useClass: ZRomulatorFilesRepository,
    },
    {
      provide: ZRomulatorFilesSystemsRepositoryToken,
      useClass: ZRomulatorFilesSystemsRepository,
    },
    {
      provide: ZRomulatorFilesGamesRepositoryToken,
      useClass: ZRomulatorFilesGamesRepository,
    },
  ],
  exports: [
    ZRomulatorFilesRepositoryToken,
    ZRomulatorFilesSystemsRepositoryToken,
    ZRomulatorFilesGamesRepositoryToken,
  ],
})
export class ZRomulatorFilesModule {
  public constructor(
    @Inject(ZRomulatorFilesRepositoryToken)
    private readonly _files: IZRomulatorFilesRepository,
  ) {}

  public async onModuleInit() {
    await this._files.init();
  }

  public async onModuleDestroy() {
    await this._files.dispose();
  }
}
