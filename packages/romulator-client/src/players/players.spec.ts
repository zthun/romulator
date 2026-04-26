import { describe, expect, it } from "vitest";

import { ZRomulatorPlayersBuilder } from "./players.mjs";

describe("Players", () => {
  const createTestTarget = () => new ZRomulatorPlayersBuilder();

  describe("Min", () => {
    it("should set the value", () => {
      const min = 2;
      expect(createTestTarget().min(min).build().min).toEqual(min);
    });
  });

  describe("Max", () => {
    it("should set the value", () => {
      const max = 8;
      expect(createTestTarget().max(max).build().max).toEqual(max);
    });
  });

  describe("Players", () => {
    const shouldSetRange = (
      expected: [number, number],
      fn: (target: ZRomulatorPlayersBuilder) => ZRomulatorPlayersBuilder,
    ) => {
      // Arrange.
      const [eMin, eMax] = expected;
      const target = createTestTarget();

      // Act.
      const { min, max } = fn(target).build();

      // Assert.
      expect(min).toEqual(eMin);
      expect(max).toEqual(eMax);
    };

    it("should set single player", () => {
      shouldSetRange([1, 1], (t) => t.singlePlayer());
    });

    it("should set two player", () => {
      shouldSetRange([1, 2], (t) => t.twoPlayer());
    });

    it("should set four player", () => {
      shouldSetRange([1, 4], (t) => t.fourPlayer());
    });

    it("should set eight player", () => {
      shouldSetRange([1, 8], (t) => t.eightPlayer());
    });
  });

  describe("Copy", () => {
    it("should clone another players object", () => {
      // Arrange.
      const expected = createTestTarget().fourPlayer().build();
      const target = createTestTarget();

      // Act.
      const actual = target.copy(expected).build();

      // Assert.
      expect(actual).toEqual(expected);
    });

    it("should not mutate the original", () => {
      // Arrange.
      const expected = createTestTarget().fourPlayer().build();
      const target = createTestTarget();

      // Act.
      const actual = target.copy(expected).build();

      // Assert.
      expect(actual).not.toBe(expected);
    });
  });

  describe("Parse", () => {
    describe("Min", () => {
      it("should set the value", () => {
        const min = 2;
        expect(createTestTarget().parse({ min }).build().min).toEqual(min);
      });

      it("should keep the existing if the candidate is not an object", () => {
        const min = 4;
        expect(
          createTestTarget().min(min).parse("not-an-object").build().min,
        ).toEqual(min);
      });

      it("should keep the existing if the minimum is not set", () => {
        const min = 1;
        expect(
          createTestTarget().min(min).parse({ max: 4 }).build().min,
        ).toEqual(min);
      });

      it("should keep the existing if candidate is undefined", () => {
        const min = 3;
        expect(
          createTestTarget().min(min).parse(undefined).build().min,
        ).toEqual(min);
      });

      it("should keep the existing if candidate is null", () => {
        const min = 2;
        expect(createTestTarget().min(min).parse(null).build().min).toEqual(
          min,
        );
      });

      it("should keep the existing if candidate.min is not a number", () => {
        const min = 3;
        expect(
          createTestTarget().min(min).parse(undefined).build().min,
        ).toEqual(min);
      });
    });

    describe("Max", () => {
      it("should set the value", () => {
        const max = 2;
        expect(createTestTarget().parse({ max }).build().max).toEqual(max);
      });

      it("should keep the existing if the candidate is not an object", () => {
        const max = 4;
        expect(
          createTestTarget().max(max).parse("not-an-object").build().max,
        ).toEqual(max);
      });

      it("should keep the existing if the minimum is not set", () => {
        const max = 1;
        expect(
          createTestTarget().max(max).parse({ min: 4 }).build().max,
        ).toEqual(max);
      });

      it("should keep the existing if candidate is undefined", () => {
        const max = 3;
        expect(
          createTestTarget().max(max).parse(undefined).build().max,
        ).toEqual(max);
      });

      it("should keep the existing if candidate is null", () => {
        const max = 2;
        expect(createTestTarget().max(max).parse(null).build().max).toEqual(
          max,
        );
      });

      it("should keep the existing if candidate.min is not a number", () => {
        const max = 3;
        expect(
          createTestTarget().max(max).parse(undefined).build().max,
        ).toEqual(max);
      });
    });
  });
});
