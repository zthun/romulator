/**
 * Represents a list of known config ids
 */
export enum ZRomulatorConfigId {
  /**
   * Config for games.
   */
  Games = "games",
  /**
   * Config id for emulators.
   */
  Emulators = "emulators",
}

export interface IZRomulatorConfig<T = any> {
  id: ZRomulatorConfigId;
  file: string;
  contents?: T;
}

export class ZRomulatorConfigBuilder<T = any> {
  private _config: IZRomulatorConfig<T> = {
    id: ZRomulatorConfigId.Games,
    file: "",
  };

  public id(id: ZRomulatorConfigId) {
    this._config.id = id;
    return this;
  }

  public file(path: string) {
    this._config.file = path;
    return this;
  }

  public contents(contents?: T) {
    this._config.contents = contents;
    return this;
  }

  public copy(other: IZRomulatorConfig<T>) {
    this._config = structuredClone(other);
    return this;
  }

  public build() {
    return structuredClone(this._config);
  }
}
