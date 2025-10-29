import { get } from "lodash-es";

/**
 * Represents a player range for a game.
 */
export interface IZRomulatorPlayers {
  /**
   * The minimum number of players.
   *
   * This is almost always (read 99.99%)
   * 1.
   */
  min: number;
  /**
   * The maximum number of players.
   */
  max: number;
}

/**
 * Creates player range instances
 */
export class ZRomulatorPlayersBuilder {
  private _players: IZRomulatorPlayers = { min: 1, max: 1 };

  /**
   * Sets the minimum supported players.
   *
   * @param players -
   *        Minimum number of players.
   *
   * @returns
   *        This object.
   */
  public min(players: number) {
    this._players.min = players;
    return this;
  }

  /**
   * Sets the maximum supported players.
   *
   * @param players -
   *        Maximum number of players.
   *
   * @returns
   *        This object.
   */
  public max(players: number) {
    this._players.max = players;
    return this;
  }

  private range(min: number, max: number) {
    return this.min(min).max(max);
  }

  /**
   * Sets the player count to 1 player for both min and max.
   *
   * @returns
   *        This object.
   */
  public singlePlayer = this.range.bind(this, 1, 1);

  /**
   * Sets the player count to 2 for max and 1 for min.
   *
   * @returns
   *        This object.
   */
  public twoPlayer = this.range.bind(this, 1, 2);

  /**
   * Sets the player count to 4 for max and 1 for min.
   *
   * @returns
   *        This object.
   */
  public fourPlayer = this.range.bind(this, 1, 4);

  /**
   * Sets the player count to 8 for max and 1 for min.
   *
   * @returns
   *        This object.
   */
  public eightPlayer = this.range.bind(this, 1, 8);

  private parseMax(candidate: object) {
    const max = get(candidate, "max");

    return typeof max === "number" ? this.max(max) : this;
  }

  private parseMin(candidate: object) {
    const min = get(candidate, "min");

    return typeof min === "number" ? this.min(min) : this;
  }

  /**
   * Attempts to read player range values from an arbitrary candidate.
   *
   * @param candidate -
   *        Source object to inspect.
   *
   * @returns
   *        This object.
   */
  public parse(candidate: unknown) {
    if (candidate == null || typeof candidate !== "object") {
      return this;
    }

    return this.parseMin(candidate).parseMax(candidate);
  }

  /**
   * Copies an existing player range into this builder.
   *
   * @param other -
   *        Players object to duplicate.
   *
   * @returns
   *        This object
   */
  public copy(other: IZRomulatorPlayers) {
    this._players = structuredClone(other);
    return this;
  }

  /**
   * Creates the final player range instance.
   *
   * @returns
   *        A cloned IZRomulatorPlayers instance.
   */
  public build() {
    return structuredClone(this._players);
  }
}
