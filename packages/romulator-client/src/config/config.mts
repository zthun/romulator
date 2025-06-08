export interface IZRomulatorConfig<T = any> {
  id: string;
  file: string;
  contents?: T;
}

export class ZRomulatorConfigBuilder<T = any> {
  private _config: IZRomulatorConfig<T> = { id: "", file: "" };

  public id(id: string) {
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

  public build() {
    return structuredClone(this._config);
  }
}
