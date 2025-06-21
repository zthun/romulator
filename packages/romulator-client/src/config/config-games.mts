export interface IZRomulatorConfigGames {
  gamesFolder?: string;
}

export class ZRomulatorConfigGamesBuilder {
  private _config: IZRomulatorConfigGames = {};

  public gamesFolder(games: string): this {
    this._config.gamesFolder = games;
    return this;
  }

  public copy(other: IZRomulatorConfigGames) {
    this._config = structuredClone(other);
    return this;
  }

  public assign(other: Partial<IZRomulatorConfigGames>) {
    this._config = { ...this._config, ...other };
    return this;
  }

  public build(): IZRomulatorConfigGames {
    return structuredClone(this._config);
  }
}
