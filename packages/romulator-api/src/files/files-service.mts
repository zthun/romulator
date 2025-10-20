import { Inject, Injectable } from "@nestjs/common";
import type { IZFileRepository, IZFileSystemNode } from "@zthun/crumbtrail-fs";
import { ZFileRepository, ZStreamFolder } from "@zthun/crumbtrail-fs";
import { detokenize, firstDefined } from "@zthun/helpful-fn";
import {
  ZDataRequestBuilder,
  ZFilterBinaryBuilder,
  ZSortBuilder,
} from "@zthun/helpful-query";
import {
  ZRomulatorConfigGamesBuilder,
  ZRomulatorConfigGamesMetadata,
  ZRomulatorConfigId,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import { trimEnd } from "lodash-es";
import { resolve, sep } from "node:path";
import { env } from "node:process";
import type { IZRomulatorConfigsService } from "../config/configs-service.mjs";
import { ZRomulatorConfigsToken } from "../config/configs-service.mjs";

export const ZRomulatorFilesToken = Symbol("files");

export interface IZRomulatorFilesService {
  media(): Promise<IZFileSystemNode[]>;
}

@Injectable()
export class ZRomulatorFilesService implements IZRomulatorFilesService {
  private static readonly MediaFolderName = ".media";
  private static readonly InfoFolderName = ".info";

  private _repository: ZFileRepository = new ZFileRepository();
  private _folderWriter = new ZStreamFolder();
  private _globs: string[];

  public constructor(
    @Inject(ZRomulatorConfigsToken)
    private readonly _configs: IZRomulatorConfigsService,
  ) {
    const slugs = Object.values(ZRomulatorSystemId);
    this._globs = [".media/**", ".info/**", ...slugs.map((s) => `${s}/*.*`)];
  }

  private async gamesFolder() {
    const config = await this._configs.get(ZRomulatorConfigId.Games);
    const { gamesFolder } = new ZRomulatorConfigGamesBuilder()
      .copy(config.contents)
      .build();
    const { fallback } = ZRomulatorConfigGamesMetadata.gamesFolder();
    const _gamesFolder = firstDefined(fallback.gamesFolder, gamesFolder);
    return detokenize(_gamesFolder, env);
  }

  private async mediaFolder() {
    const gamesFolder = await this.gamesFolder();
    return resolve(gamesFolder, ZRomulatorFilesService.MediaFolderName);
  }

  private async infoFolder() {
    const gamesFolder = await this.gamesFolder();
    return resolve(gamesFolder, ZRomulatorFilesService.InfoFolderName);
  }

  private async repository(): Promise<IZFileRepository> {
    const path = await this.gamesFolder();

    if (this._repository.path !== path) {
      await this._folderWriter.write(await this.mediaFolder());
      await this._folderWriter.write(await this.infoFolder());
      await this._repository.initialize(path, this._globs);
    }

    return this._repository;
  }

  public async media(): Promise<IZFileSystemNode[]> {
    const repository = await this.repository();
    const prefix = trimEnd(await this.mediaFolder(), "/");
    const folder = `${prefix}${sep}`;

    const filter = new ZFilterBinaryBuilder()
      .subject("path")
      .startsWith()
      .value(folder)
      .build();

    const sort = new ZSortBuilder().ascending("path").build();

    const request = new ZDataRequestBuilder().filter(filter).sort(sort).build();
    return repository.retrieve(request);
  }
}
