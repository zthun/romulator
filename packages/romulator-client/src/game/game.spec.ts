import { describe, expect, it } from "vitest";
import { ZRomulatorSystemId } from "../system/system-id.mjs";
import { ZRomulatorGameBuilder } from "./game.mjs";

describe("Game", () => {
  const createTestTarget = () => new ZRomulatorGameBuilder();

  describe("Id", () => {
    it("should set the id", () => {
      const expected = "nes-super-mario-bros";
      expect(createTestTarget().id(expected).build().id).toEqual(expected);
    });
  });

  describe("Name", () => {
    it("should set the name", () => {
      const expected = "Super Mario Bros.";
      expect(createTestTarget().name(expected).build().name).toEqual(expected);
    });
  });

  describe("File", () => {
    it("should set the file path", () => {
      const expected = "/roms/nes/super-mario-bros.zip";
      expect(createTestTarget().file(expected).build().file).toEqual(expected);
    });
  });

  describe("System", () => {
    it("should set the system id", () => {
      const expected = ZRomulatorSystemId.Nintendo;
      expect(createTestTarget().system(expected).build().system).toEqual(
        expected,
      );
    });
  });

  describe("Copy", () => {
    it("should copy the values from another game", () => {
      const other = {
        id: "nes-super-mario-bros",
        name: "Super Mario Bros.",
        file: "/roms/nes/super-mario-bros.zip",
        system: ZRomulatorSystemId.Nintendo,
      };

      expect(createTestTarget().copy(other).build()).toEqual(other);
    });

    it("should copy the values into a structured clone", () => {
      const other = {
        id: "nes-super-mario-bros",
        name: "Super Mario Bros.",
        file: "/roms/nes/super-mario-bros.zip",
        system: ZRomulatorSystemId.Nintendo,
      };

      const target = createTestTarget().copy(other);
      const result = target.build();
      other.name = "The Lost Levels";

      expect(result.name).toEqual("Super Mario Bros.");
    });
  });

  describe("Build", () => {
    it("should remove undefined properties", () => {
      const actual = createTestTarget().name("Super Mario Bros.").build();
      expect(actual.id).toBeUndefined();
      expect(actual.system).toBeUndefined();
    });

    it("should clone the underlying state", () => {
      const target = createTestTarget().name("Super Mario Bros.");
      const first = target.build();
      first.name = "Modified";

      expect(target.build().name).toEqual("Super Mario Bros.");
    });
  });
});
