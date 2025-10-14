import { isUndefined, kebabCase, omitBy } from "lodash-es";
import { basename, extname, sep } from "node:path";
import type { ZRomulatorSystemId } from "../system/system-id.mjs";
import { isSystemId } from "../system/system-id.mjs";
import {
  isGameMediaType,
  isSystemMediaType,
  type ZRomulatorMediaType,
} from "./media-type.mjs";

/**
 * Represents a piece of media for a game or system.
 */
export interface IZRomulatorMedia {
  /**
   * The id of the media.
   */
  id?: string;

  /**
   * The id of the system that the media maps to.
   */
  system?: ZRomulatorSystemId;

  /**
   * The type of media this represents.
   */
  type?: ZRomulatorMediaType;

  /**
   * The id slug of the game if this media represents game media.
   */
  game?: string;

  /**
   * The name of the file.
   */
  fileName?: string;

  /**
   * The full url path for the media.
   */
  url?: string;
}

/**
 * A builder for the media object.
 */
export class ZRomulatorMediaBuilder {
  private _media: IZRomulatorMedia = {};

  public id(id: string) {
    this._media.id = id;
    return this;
  }

  public type(type: ZRomulatorMediaType) {
    this._media.type = type;
    return this;
  }

  public system(system: ZRomulatorSystemId) {
    this._media.system = system;
    return this;
  }

  public game(game: string | undefined) {
    this._media.game = game;
    return this;
  }

  public filename(name: string) {
    this._media.fileName = name;
    return this;
  }

  public url(url: string) {
    this._media.url = url;
    return this;
  }

  public from(path: string) {
    const hierarchy = path.split(sep);
    let builder = this.url(path);

    // The media structure is split into 2 or 3 parts
    // fileName = game file name or system media type name
    // parent = media type for games or system type for systems
    // grandparent = system type for games.

    const fileName = hierarchy[hierarchy.length - 1];
    const parent = hierarchy[hierarchy.length - 2];
    const grandparent = hierarchy[hierarchy.length - 3];

    if (!fileName) {
      // If we don't even have a file name - then this
      // isn't even media at all.
      return builder;
    }

    builder = builder.filename(fileName);
    const ext = extname(fileName);
    const title = basename(fileName, ext);

    if (isSystemMediaType(fileName) && isSystemId(parent)) {
      // This is media for system hardware
      const id = `${parent}-${kebabCase(title)}`;
      return builder.id(id).system(parent).type(fileName).game(undefined);
    }

    if (fileName && isGameMediaType(parent) && isSystemId(grandparent)) {
      // This is media for a game that is supported.  The id for a game
      // is the system id followed by the kebab case of the title, followed
      // by the media type.
      const game = kebabCase(title);
      const id = `${grandparent}-${game}-${parent}`;
      return builder.id(id).system(grandparent).type(parent).game(game);
    }

    return builder;
  }

  public build() {
    const clone = structuredClone(this._media);
    return omitBy(clone, isUndefined) as IZRomulatorMedia;
  }
}
