import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { firstDefined, firstTruthy } from "@zthun/helpful-fn";
import type { IZDataRequest, IZPage } from "@zthun/helpful-query";
import {
  ZDataRequestBuilder,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZFilterBinaryBuilder,
  ZPageBuilder,
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
import type { IZRestfulGet } from "@zthun/webigail-rest";
import {
  ZRomulatorFilesGamesRepositoryToken,
  type IZRomulatorFilesGamesRepository,
} from "../files/files-games-repository.mjs";
import {
  ZRomulatorFilesSystemsRepositoryToken,
  type IZRomulatorFilesSystemsRepository,
} from "../files/files-systems-repository.mjs";

export const ZRomulatorGamesToken = Symbol("romulator-games-service");

export interface IZRomulatorGamesService extends IZRestfulGet<IZRomulatorGame> {
  list(req: IZDataRequest): Promise<IZPage<IZRomulatorGame>>;
}

@Injectable()
export class ZRomulatorGamesService implements IZRomulatorGamesService {
  private readonly _logger: IZLogger;

  public constructor(
    @Inject(ZRomulatorFilesSystemsRepositoryToken)
    private readonly _systemsRepository: IZRomulatorFilesSystemsRepository,
    @Inject(ZRomulatorFilesGamesRepositoryToken)
    private readonly _filesRepository: IZRomulatorFilesGamesRepository,
    @Inject(ZLoggerToken)
    readonly logger: IZLogger,
  ) {
    this._logger = new ZLoggerContext("ZRomulatorGamesService", logger);
  }

  public async list(req: IZDataRequest): Promise<IZPage<IZRomulatorGame>> {
    const msg = `Searching for games`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const systems = await this._systemsRepository.systems();
    const games = await this._filesRepository.games();

    const match = (data: IZRomulatorGame, filter: string): boolean => {
      const needle = filter?.trim().toLowerCase();
      const { name = "", system = "" } = data;
      const systemId = system as ZRomulatorSystemId;
      const systemName = firstTruthy("", systems.get(systemId)?.name);

      if (!needle?.length) {
        return true;
      }

      return [name, system, systemName]
        .filter((s) => s.length)
        .some((k) => k.toLowerCase().includes(needle));
    };

    const options = new ZDataSourceStaticOptionsBuilder<IZRomulatorGame>()
      .search({ match })
      .build();
    const source = new ZDataSourceStatic(Array.from(games.values()), options);

    const $sort = new ZSortBuilder()
      .sorts(firstDefined([], req.sort))
      .ascending("system")
      .ascending("name")
      .build();
    const $request = new ZDataRequestBuilder().copy(req).sort($sort).build();

    const data = await source.retrieve($request);
    const count = await source.count($request);

    return new ZPageBuilder().count(count).data(data).build();
  }

  public async get(id: string): Promise<IZRomulatorGame> {
    const filter = new ZFilterBinaryBuilder()
      .subject("id")
      .equal()
      .value(id)
      .build();
    const request = new ZDataRequestBuilder().filter(filter).size(1).build();

    const { data: games } = await this.list(request);
    const [game] = games;

    if (game == null) {
      const message = `Game, ${id}, was not found.`;
      throw new NotFoundException(message);
    }

    return game;
  }
}
