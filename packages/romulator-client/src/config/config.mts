import { firstDefined } from "@zthun/helpful-fn";
import type { IZMetadata } from "@zthun/helpful-query";
import { castArray } from "lodash-es";

/**
 * Represents a list of known config ids
 */
export enum ZRomulatorConfigId {
  /**
   * Config for games.
   */
  Games = "games",

  /**
   * Config id for media.
   */
  Media = "media",
}

export interface IZRomulatorConfig<T = any> {
  id: ZRomulatorConfigId;
  name: string;

  avatar?: string;
  contents?: T;
  description?: string;
  file: string;
  metadata?: IZMetadata[];
}

export class ZRomulatorConfigBuilder<T = any> {
  private _config: IZRomulatorConfig<T> = {
    id: ZRomulatorConfigId.Games,
    name: "",
    file: "",
  };

  public id(id: ZRomulatorConfigId) {
    this._config.id = id;
    return this;
  }

  public avatar(id: string) {
    this._config.avatar = id;
    return this;
  }

  public name(name: string) {
    this._config.name = name;
    return this;
  }

  public description(description: string) {
    this._config.description = description;
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

  public metadata(meta: IZMetadata | IZMetadata[]) {
    const metadata = firstDefined([], this._config.metadata);
    this._config.metadata = metadata.concat(castArray(meta));
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
