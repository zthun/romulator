import { kebabCase } from "lodash-es";
import { basename, extname } from "node:path";
import { describe, expect, it } from "vitest";
import {
  isMediaType,
  ZRomulatorGameMediaType,
  ZRomulatorSystemMediaType,
} from "./media-type.mjs";
import { ZRomulatorMediaBuilder } from "./media.mjs";

describe("Media", () => {
  const createTestTarget = () => new ZRomulatorMediaBuilder();

  describe("From Path", () => {
    it("should set the url", () => {
      const expected = "/path/to/media/snes/videos/Bahamut Lagoon (Japan).mp4";
      expect(createTestTarget().from(expected).build().url).toEqual(expected);
    });

    describe("None", () => {
      const shouldMapToNoMedia = (path: string) => {
        expect(createTestTarget().from(path).build().type).toBeUndefined();
      };

      it("should map to the no media type if an empty path is given", () => {
        shouldMapToNoMedia("");
      });

      it("should map to no media type if the type is missing", () => {
        shouldMapToNoMedia("wheel.png");
      });

      it("should map to no media type if the type cannot be determined", () => {
        shouldMapToNoMedia("/lol-wut/wheel.png");
      });

      it("should map to no media type if the system is missing", () => {
        shouldMapToNoMedia("/covers/yoshi.png");
      });

      it("should map to no media type if the system is is not supported", () => {
        shouldMapToNoMedia("/switch99/covers/yoshi.png");
      });
    });

    describe("Game", () => {
      const system = "nes";
      const type = ZRomulatorGameMediaType.Cover;
      const fileTitle = "StarTropics (USA)";
      const fileName = `${fileTitle}.png`;
      const path = `/path/to/media/${system}/${type}/${fileName}`;

      it("should map the system id", () => {
        expect(createTestTarget().from(path).build().system).toEqual(system);
      });

      it("should map the media type", () => {
        expect(createTestTarget().from(path).build().type).toEqual(type);
      });

      it("should map the game id", () => {
        const expected = kebabCase(fileTitle);
        expect(createTestTarget().from(path).build().game).toEqual(expected);
      });

      it("should map the id to a combination of the system, type, and game", () => {
        const game = kebabCase(fileTitle);
        const expected = `${system}-${game}-${type}`;
        expect(createTestTarget().from(path).build().id).toEqual(expected);
      });
    });

    describe("System", () => {
      const system = "gc";
      const type = ZRomulatorSystemMediaType.Controller;
      const title = basename(type, extname(type));
      const path = `/path/to/media/${system}/${type}`;

      it("should map the system id", () => {
        expect(createTestTarget().from(path).build().system).toEqual(system);
      });

      it("should map the media type", () => {
        expect(createTestTarget().from(path).build().type).toEqual(type);
      });

      it("should set the game to falsy", () => {
        expect(createTestTarget().from(path).build().game).toBeUndefined();
      });

      it("should map the id to a combination of the system and type", () => {
        const expected = `${system}-${title}`;
        expect(createTestTarget().from(path).build().id).toEqual(expected);
      });
    });
  });

  describe("IsMediaType", () => {
    it("should return true for supported media", () => {
      expect(isMediaType(ZRomulatorGameMediaType.Cover)).toBeTruthy();
    });

    it("should return false for unsupported media", () => {
      expect(isMediaType("wallpapers")).toBeFalsy();
    });

    it("should return false for non strings", () => {
      expect(isMediaType(42)).toBeFalsy();
    });

    it("should return false for undefined", () => {
      expect(isMediaType(undefined)).toBeFalsy();
    });

    it("should return false for null", () => {
      expect(isMediaType(null)).toBeFalsy();
    });
  });
});
