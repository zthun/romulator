import type { ZOptional } from "@zthun/helpful-fn";
import { describe, expect, it } from "vitest";
import { ZRomulatorPlayersSerialize } from "./players-serialize.mjs";
import {
  ZRomulatorPlayersBuilder,
  type IZRomulatorPlayers,
} from "./players.mjs";

describe("ZRomulatorPlayersSerialize", () => {
  const createTestTarget = () => new ZRomulatorPlayersSerialize();

  const shouldReturnString = (
    expected: string | undefined,
    players: ZOptional<IZRomulatorPlayers>,
  ) => {
    // Arrange.
    const target = createTestTarget();

    // Act.
    const actual = target.serialize(players);

    // Assert.
    expect(actual).toEqual(expected);
  };

  it("should return undefined if candidate is undefined", () => {
    shouldReturnString(undefined, undefined);
  });

  it("should return the undefined if candidate is null", () => {
    shouldReturnString(undefined, null);
  });

  it("should return the range of min-max", () => {
    shouldReturnString(
      "1-4",
      new ZRomulatorPlayersBuilder().fourPlayer().build(),
    );
  });

  it("should return a single number if max = min", () => {
    shouldReturnString(
      "1",
      new ZRomulatorPlayersBuilder().singlePlayer().build(),
    );
  });
});
