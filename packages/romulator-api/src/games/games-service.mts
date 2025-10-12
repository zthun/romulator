import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IZFileSystemService } from "@zthun/crumbtrail-fs";
import { ZFileSystemToken } from "@zthun/crumbtrail-nest";
import { detokenize, firstDefined } from "@zthun/helpful-fn";
import type { IZDataRequest } from "@zthun/helpful-query";
import {
  ZDataRequestBuilder,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZSortBuilder,
} from "@zthun/helpful-query";
import {
  ZLogEntryBuilder,
  ZLoggerContext,
  type IZLogger,
} from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import type {
  IZRomulatorGame,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import {
  ZRomulatorConfigGamesBuilder,
  ZRomulatorConfigGamesMetadata,
  ZRomulatorGameBuilder,
} from "@zthun/romulator-client";
import type { IZRestfulGet } from "@zthun/webigail-rest";
import { kebabCase } from "lodash-es";
import { basename, dirname, parse } from "node:path";
import { ZRomulatorConfigKnown } from "../config/config-known.mjs";
import type { IZRomulatorConfigsService } from "../config/configs-service.mjs";
import { ZRomulatorConfigsToken } from "../config/configs-service.mjs";
import { ZRomulatorSystemKnown } from "../systems/system-known.mjs";
import { ZRomulatorDataMatchGame } from "./data-match-game.mjs";

export const ZRomulatorGamesToken = Symbol("romulator-games-service");

export interface IZRomulatorGamesService extends IZRestfulGet<IZRomulatorGame> {
  list(req: IZDataRequest): Promise<IZRomulatorGame[]>;
}

@Injectable()
export class ZRomulatorGamesService implements IZRomulatorGamesService {
  private readonly _logger: IZLogger;

  public constructor(
    @Inject(ZFileSystemToken)
    private readonly _file: IZFileSystemService,
    @Inject(ZRomulatorConfigsToken)
    private readonly _config: IZRomulatorConfigsService,
    @Inject(ZLoggerToken) logger: IZLogger,
  ) {
    this._logger = new ZLoggerContext("ZRomulatorGamesService", logger);
  }

  public async list(req: IZDataRequest): Promise<IZRomulatorGame[]> {
    const config = ZRomulatorConfigKnown.games();
    const { contents } = await this._config.get(config.id);
    const { gamesFolder } = new ZRomulatorConfigGamesBuilder()
      .copy(contents)
      .build();
    const { fallback } = ZRomulatorConfigGamesMetadata.gamesFolder();

    const cwd = detokenize(firstDefined(fallback, gamesFolder), process.env);
    const time = new Date();

    let msg = `Searching for games in ${cwd}`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const systems = ZRomulatorSystemKnown.all().map((system) => system.id);
    const glob = `{${systems.join(",")}}/**/*.zip`;
    const nodes = await this._file.search(glob, { cwd, stat: false });
    const span = new Date().getTime() - time.getTime();

    msg = `Found ${nodes.length} games. Search took ${span} milliseconds.`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const games = nodes.map(({ path }) => {
      const dir = basename(dirname(path)) as ZRomulatorSystemId;
      const { name: file } = parse(path);
      const id = `${dir}-${kebabCase(file)}`;

      return new ZRomulatorGameBuilder()
        .id(id)
        .system(dir)
        .file(path)
        .name(file)
        .build();
    });

    const options = new ZDataSourceStaticOptionsBuilder<IZRomulatorGame>()
      .search(new ZRomulatorDataMatchGame())
      .build();
    const source = new ZDataSourceStatic(games, options);

    const $sort = new ZSortBuilder()
      .sorts(firstDefined([], req.sort))
      .ascending("system")
      .ascending("name")
      .build();
    const $request = new ZDataRequestBuilder().copy(req).sort($sort).build();
    const data = await source.retrieve($request);

    return data;
  }

  public async get(id: string): Promise<IZRomulatorGame> {
    const games = await this.list(new ZDataRequestBuilder().build());
    const match = games.find((game) => game.id === id);

    if (!match) {
      throw new NotFoundException(`Unable to find game with id, ${id}.`);
    }

    return match;
  }
}
