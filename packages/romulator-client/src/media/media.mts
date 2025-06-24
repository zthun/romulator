import type { ZRomulatorMediaType } from "./media-type.mjs";

/**
 * Represents a piece of media for a game or system.
 */
export interface IZRomulatorMedia {
  /**
   * The id of the media.
   */
  id?: string;
  /**
   * The type of media this represents.
   */
  type?: ZRomulatorMediaType;
  /**
   * The url path for the media.
   */
  url?: string;
}

/**
 * A builder for the media object.
 */
export class ZRomulatorMediaBuilder {
  private _media: IZRomulatorMedia;

  public id(id: string) {
    this._media.id = id;
    return this;
  }

  public type(type: ZRomulatorMediaType) {
    this._media.type = type;
    return this;
  }

  public url(url: string) {
    this._media.url = url;
    return this;
  }

  public build() {
    return structuredClone(this._media);
  }
}
