import { get } from "lodash-es";

export interface IZRomulatorPlayers {
  min: number;
  max: number;
}

export class ZRomulatorPlayersBuilder {
  private _players: IZRomulatorPlayers = { min: 1, max: 1 };

  public min(players: number) {
    this._players.min = players;
    return this;
  }

  public max(players: number) {
    this._players.max = players;
    return this;
  }

  private range(min: number, max: number) {
    return this.min(min).max(max);
  }

  public singlePlayer = this.range.bind(this, 1, 1);
  public twoPlayer = this.range.bind(this, 1, 2);
  public fourPlayer = this.range.bind(this, 1, 4);
  public eightPlayer = this.range.bind(this, 1, 8);

  private parseMax(candidate: object) {
    const max = get(candidate, "max");

    return typeof max === "number" ? this.max(max) : this;
  }

  private parseMin(candidate: object) {
    const min = get(candidate, "min");

    return typeof min === "number" ? this.min(min) : this;
  }

  public parse(candidate: unknown) {
    if (candidate == null || typeof candidate !== "object") {
      return this;
    }

    return this.parseMin(candidate).parseMax(candidate);
  }

  public copy(other: IZRomulatorPlayers) {
    this._players = structuredClone(other);
    return this;
  }

  public build() {
    return structuredClone(this._players);
  }
}
