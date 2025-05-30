export interface IZRomulatorConfigGames {
  gamesFolder?: string;
  mediaFolder?: string;
}

export class ZRomulatorConfigGamesBuilder {
  private _config: IZRomulatorConfigGames = {};

  public gamesFolder(games: string): this {
    this._config.gamesFolder = games;
    return this;
  }

  public mediaFolder(media: string): this {
    this._config.mediaFolder = media;
    return this;
  }

  public build(): IZRomulatorConfigGames {
    return structuredClone(this._config);
  }
}
