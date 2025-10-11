import { isUndefined, omitBy } from "lodash-es";
import type { ZRomulatorSystemId } from "../system/system-id.mjs";

/**
 * Represents a rom file or image.
 */
export interface IZRomulatorGame {
  /**
   * The id of the game.
   *
   * This is unique across all games and all systems.
   */
  id?: string;

  /**
   * The name of the game.
   *
   * This is not unique across systems.  For example,
   * Battletoads and Double Dragon has the same name
   * across 3 different systems.
   */
  name?: string;

  /**
   * The fully qualified path to the game file.
   */
  file?: string;

  /**
   * The system id that this game belongs to.
   */
  system?: ZRomulatorSystemId;
}

/**
 * A builder for the IZRomulatorGame model.
 */
export class ZRomulatorGameBuilder {
  private _game: IZRomulatorGame = {};

  /**
   * Sets the unique id for the game.
   *
   * @param id -
   *        The unique identifier across all games and systems.
   * @returns
   *        This instance.
   */
  public id(id: string): this {
    this._game.id = id;
    return this;
  }

  /**
   * Sets the display name for the game.
   *
   * @param name -
   *        The canonical display name for the game.
   * @returns
   *        This instance.
   */
  public name(name: string): this {
    this._game.name = name;
    return this;
  }

  /**
   * Sets the file path for the rom.
   *
   * @param path -
   *        The fully qualified path to the game file.
   * @returns
   *        This instance.
   */
  public file(path: string): this {
    this._game.file = path;
    return this;
  }

  /**
   * Sets the system the game belongs to.
   *
   * @param system -
   *        The owning system id.
   * @returns
   *        This instance.
   */
  public system(system: ZRomulatorSystemId): this {
    this._game.system = system;
    return this;
  }

  /**
   * Copies an existing game into this builder.
   *
   * @param other -
   *        The other game to copy.
   * @returns
   *        This instance.
   */
  public copy(other: IZRomulatorGame): this {
    this._game = structuredClone(other);
    return this;
  }

  /**
   * Builds the game instance.
   *
   * @returns
   *        A structured clone of the current game with undefined properties removed.
   */
  public build() {
    const clone = structuredClone(this._game);
    return omitBy(clone, isUndefined) as IZRomulatorGame;
  }
}
