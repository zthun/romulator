import {
  ZRomulatorGameBuilder,
  ZRomulatorGameMediaType,
  ZRomulatorSystemBuilder,
  ZRomulatorSystemId,
  ZRomulatorSystemMediaType,
  type IZRomulatorGame,
  type IZRomulatorSystem,
  type ZRomulatorMediaType,
} from "@zthun/romulator-client";
import { ZUrlBuilder } from "@zthun/webigail-url";
import { describe, expect, it } from "vitest";
import { ZRomulatorEnvironmentBuilder } from "../environment/environment.mjs";
import { ZRomulatorMediaService } from "./media-service.js";

describe("ZRomulatorMediaService", () => {
  const environment = new ZRomulatorEnvironmentBuilder().build();

  const createTestTarget = () => new ZRomulatorMediaService(environment);

  describe("URL", () => {
    const shouldReturnUrl = async (
      expected: string,
      gameOrSystem: IZRomulatorGame | IZRomulatorSystem,
      type: ZRomulatorMediaType,
    ) => {
      // Arrange.
      const target = createTestTarget();

      // Act.
      const actual = target.url(gameOrSystem, type);

      // Assert.
      expect(actual).toEqual(expected);
    };

    describe("Game", () => {
      const mario = new ZRomulatorGameBuilder()
        .id("nes-mario")
        .name("Super Mario Bros.")
        .system(ZRomulatorSystemId.Nintendo)
        .build();

      Object.values(ZRomulatorGameMediaType).forEach((type) => {
        it(`should return the media url for a game with type, ${type}`, async () => {
          const { id } = mario;
          const segment = `${id}-${type}`;
          const expected = new ZUrlBuilder()
            .parse(environment.api)
            .append("media")
            .append(segment)
            .build();

          await shouldReturnUrl(expected, mario, type);
        });
      });
    });

    describe("System", () => {
      const nes = new ZRomulatorSystemBuilder()
        .id(ZRomulatorSystemId.Nintendo)
        .name("Nintendo NES")
        .build();

      Object.values(ZRomulatorSystemMediaType).forEach((type) => {
        it(`should return the media url for a system with type, ${type}`, async () => {
          const { id } = nes;
          const segment = `${id}-${type}`;
          const expected = new ZUrlBuilder()
            .parse(environment.api)
            .append("media")
            .append(segment)
            .build();

          await shouldReturnUrl(expected, nes, type);
        });
      });
    });
  });
});
