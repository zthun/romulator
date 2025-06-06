import { resolve } from "node:path";
import { ZDir } from "../dir/dir.js";

export interface IZRomulatorConfig<T = any> {
  id: string;
  file: string;
  contents?: T;
}

export class ZRomulatorConfigBuilder<T = any> {
  private _config: IZRomulatorConfig<T> = { id: "", file: "" };

  public static all(): IZRomulatorConfig[] {
    return [new ZRomulatorConfigBuilder().games().build()];
  }

  public from(id: string) {
    this._config.file = resolve(ZDir.configs(), `${id}.json`);
    this._config.id = id;
    return this;
  }

  public contents(contents: T) {
    this._config.contents = contents;
    return this;
  }

  public games = this.from.bind(this, "games");

  public copy(other: IZRomulatorConfig<T>) {
    this._config = structuredClone(other);
    return this;
  }

  public assign(other: Partial<IZRomulatorConfig<T>>) {
    this._config.contents = {
      ...this._config.contents,
      ...other.contents,
    } as T;

    return this;
  }

  public cast<K>() {
    return new ZRomulatorConfigBuilder<K>().copy(
      this._config as unknown as IZRomulatorConfig<K>,
    );
  }

  public build() {
    return structuredClone(this._config);
  }
}
