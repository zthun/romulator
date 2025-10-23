import { Inject, Module } from "@nestjs/common";
import { ZFileSystemModule } from "@zthun/crumbtrail-nest";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import type { IZRomulatorFilesRepository } from "./files-repository.mjs";
import {
  ZRomulatorFilesRepository,
  ZRomulatorFilesToken,
} from "./files-repository.mjs";

@Module({
  imports: [ZFileSystemModule, ZRomulatorConfigsModule],
  providers: [
    { provide: ZRomulatorFilesToken, useClass: ZRomulatorFilesRepository },
  ],
  exports: [ZRomulatorFilesToken],
})
export class ZRomulatorFilesModule {
  public constructor(
    @Inject(ZRomulatorFilesToken)
    private readonly _files: IZRomulatorFilesRepository,
  ) {}

  public async onModuleInit() {
    await this._files.init();
  }

  public async onModuleDestroy() {
    await this._files.dispose();
  }
}
