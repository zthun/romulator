export interface IZRomulatorConfig {
  games?: string;
  media?: string;
}

export class ZRomulatorConfigBuilder {
  private _config: IZRomulatorConfig;

  public constructor() {
    this._config = {};
  }

  public games(path: string): this {
    this._config.games = path;
    return this;
  }

  public media(path: string): this {
    this._config.media = path;
    return this;
  }

  public build() {
    return structuredClone(this._config);
  }
}
