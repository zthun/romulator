import type { IZSerialize, ZOptional } from "@zthun/helpful-fn";
import type { IZRomulatorPlayers } from "./players.mjs";

/**
 * Represents a serializer for a players object.
 *
 * The serialized form of players is a single digit if min and max are equal, or
 * a range string of #min-#max if they are different.
 */
export class ZRomulatorPlayersSerialize implements IZSerialize<IZRomulatorPlayers> {
  public serialize(
    candidate: ZOptional<IZRomulatorPlayers>,
  ): string | undefined {
    if (candidate == null) {
      return undefined;
    }

    const { min, max } = candidate;

    return min === max ? `${min}` : `${min}-${max}`;
  }
}
