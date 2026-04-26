import { get, isUndefined, omitBy } from "lodash-es";

import {
  type IZRomulatorPlayers,
  ZRomulatorPlayersBuilder,
} from "../players/players.mjs";
import { ZRomulatorSystemId } from "../system/system-id.mjs";

/**
 * Represents a rom file or image.
 */
export interface IZRomulatorGame {
  /**
   * The id of the game.
   *
   * This is unique across all games and all systems.
   */
  id: string;

  /**
   * The name of the game.
   *
   * This is not unique across systems.  For example,
   * Battletoads and Double Dragon has the same name
   * across 3 different systems.
   */
  name: string;

  /**
   * The fully qualified path to the game file.
   */
  file: string;

  /**
   * The system id that this game belongs to.
   */
  system: ZRomulatorSystemId;

  /**
   * The date the game was released.
   */
  release: string;

  /**
   * The developer studio.
   */
  developer: string;

  /**
   * The publisher studio.
   */
  publisher: string;

  /**
   * The game description.
   */
  description: string;

  /**
   * The player information.
   */
  players: IZRomulatorPlayers;
}

/**
 * A builder for the IZRomulatorGame model.
 */
export class ZRomulatorGameBuilder {
  private _game: IZRomulatorGame = {
    id: "",
    name: "",
    file: "",
    system: ZRomulatorSystemId.Adam,
    release: "",
    description: "",
    developer: "",
    publisher: "",
    players: new ZRomulatorPlayersBuilder().build(),
  };

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
   * Sets the release date for the game.
   *
   * @param release -
   *        The release information for the game.
   * @returns
   *        This instance.
   */
  public release(release: string): this {
    this._game.release = release;
    return this;
  }

  /**
   * Sets the developer studio for the game.
   *
   * @param developer -
   *        The developer name.
   * @returns
   *        This instance.
   */
  public developer(developer: string): this {
    this._game.developer = developer;
    return this;
  }

  /**
   * Sets the publisher studio for the game.
   *
   * @param publisher -
   *        The publisher name.
   * @returns
   *        This instance.
   */
  public publisher(publisher: string): this {
    this._game.publisher = publisher;
    return this;
  }

  /**
   * Sets the description for the game.
   *
   * @param description -
   *        The game description.
   * @returns
   *        This instance.
   */
  public description(description: string): this {
    this._game.description = description;
    return this;
  }

  /**
   * Sets the player configuration for the game.
   *
   * @param players -
   *        The player configuration.
   * @returns
   *        This instance.
   */
  public players(players: IZRomulatorPlayers): this {
    this._game.players = new ZRomulatorPlayersBuilder().copy(players).build();
    return this;
  }

  private parseDeveloper(candidate: object): this {
    const developer = get(candidate, "developer");

    return typeof developer === "string" ? this.developer(developer) : this;
  }

  private parsePublisher(candidate: object): this {
    const publisher = get(candidate, "publisher");

    return typeof publisher === "string" ? this.publisher(publisher) : this;
  }

  private parseReleaseDate(candidate: object): this {
    const release = get(candidate, "release");

    return typeof release == "string" ? this.release(release) : this;
  }

  private parsePlayers(candidate: object): this {
    const players = get(candidate, "players");

    return this.players(
      new ZRomulatorPlayersBuilder()
        .copy(this._game.players)
        .parse(players)
        .build(),
    );
  }

  private parseDescription(candidate: object): this {
    const description = get(candidate, "description");

    return typeof description === "string"
      ? this.description(description)
      : this;
  }

  private parseName(candidate: object): this {
    const name = get(candidate, "name");

    return typeof name === "string" ? this.name(name) : this;
  }

  /**
   * Attempts to parse a game from a game entry in a system.json game
   * list.
   *
   * @param candidate -
   *        The candidate to parse.
   *
   * @returns
   *        This object.
   */
  public parse(candidate: unknown): this {
    if (candidate == null || typeof candidate !== "object") {
      return this;
    }

    return this.parseName(candidate)
      .parseDescription(candidate)
      .parsePlayers(candidate)
      .parseReleaseDate(candidate)
      .parseDeveloper(candidate)
      .parsePublisher(candidate);
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
