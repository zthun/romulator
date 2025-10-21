import { Inject, Module } from "@nestjs/common";
import { ZFileSystemModule } from "@zthun/crumbtrail-nest";
import { ZRomulatorConfigsModule } from "../config/configs-module.mjs";
import type { IZRomulatorFilesService } from "./files-service.mjs";
import {
  ZRomulatorFilesService,
  ZRomulatorFilesToken,
} from "./files-service.mjs";

@Module({
  imports: [ZFileSystemModule, ZRomulatorConfigsModule],
  providers: [
    { provide: ZRomulatorFilesToken, useClass: ZRomulatorFilesService },
  ],
  exports: [ZRomulatorFilesToken],
})
export class ZRomulatorFilesModule {
  public constructor(
    @Inject(ZRomulatorFilesToken)
    private readonly _files: IZRomulatorFilesService,
  ) {}

  public async onModuleInit() {
    await this._files.init();
  }

  public async onModuleDestroy() {
    await this._files.dispose();
  }
}
