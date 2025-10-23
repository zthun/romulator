import { describe, expect, it } from "vitest";
import { isSystemId, ZRomulatorSystemId } from "./system-id.mjs";
import { ZRomulatorSystemBuilder } from "./system.mjs";

describe("ZRomulatorSystem", () => {
  const createTestTarget = () => new ZRomulatorSystemBuilder();

  describe("Parse", () => {
    it("should return the same state if the candidate is null", () => {
      const expected = createTestTarget().build();

      expect(createTestTarget().parse(null).build()).toEqual(expected);
    });

    it("should return the same state if the candidate is undefined", () => {
      const expected = createTestTarget().build();

      expect(createTestTarget().parse(undefined).build()).toEqual(expected);
    });

    it("should return the same state if the candidate is not an object", () => {
      const expected = createTestTarget().build();

      expect(createTestTarget().parse("not-a-candidate").build()).toEqual(
        expected,
      );
    });

    describe("Id", () => {
      it("should set the id if there is an id on the candidate", () => {
        const id = ZRomulatorSystemId.SuperNintendo;

        expect(createTestTarget().parse({ id }).build().id).toEqual(id);
      });

      it("should keep the id if the id is not a system id", () => {
        const id = "not-a-system";
        const expected = ZRomulatorSystemId.Genesis;

        expect(
          createTestTarget().id(expected).parse({ id }).build().id,
        ).toEqual(expected);
      });

      it("should keep the id if the id is not present on the candidate", () => {
        const expected = ZRomulatorSystemId.Genesis;

        expect(createTestTarget().id(expected).parse({}).build().id).toEqual(
          expected,
        );
      });
    });

    describe("Name", () => {
      it("should set the name if there is a string name on the candidate", () => {
        const name = "Super Nintendo";

        expect(createTestTarget().parse({ name }).build().name).toEqual(name);
      });

      it("should keep the name if the name is not a string", () => {
        const name = 42;
        const expected = "Original";

        expect(
          createTestTarget().name(expected).parse({ name }).build().name,
        ).toEqual(expected);
      });

      it("should keep the name if the name does not exist", () => {
        const expected = "Original";

        expect(
          createTestTarget().name(expected).parse({}).build().name,
        ).toEqual(expected);
      });
    });

    describe("Company", () => {
      it("should set the company if there is a string name on the candidate", () => {
        const company = "Sega";

        expect(createTestTarget().parse({ company }).build().company).toEqual(
          company,
        );
      });

      it("should keep the company if the company is not a string", () => {
        const company = 42;
        const expected = "Original";

        expect(
          createTestTarget().company(expected).parse({ company }).build()
            .company,
        ).toEqual(expected);
      });

      it("should keep the company if the company does not exist", () => {
        const expected = "Original";

        expect(
          createTestTarget().company(expected).parse({}).build().company,
        ).toEqual(expected);
      });
    });

    describe("Extensions", () => {
      it("should set the extensions", () => {
        const extensions = ["7z", "nes", "zip"];
        expect(
          createTestTarget().parse({ extensions }).build().extensions,
        ).toEqual(expect.arrayContaining(extensions));
      });

      it("should keep the extensions if the extension list is not an array", () => {
        const extensions = ["7z", "nes", "zip"];
        expect(
          createTestTarget().parse({ extensions }).build().extensions,
        ).toEqual(expect.arrayContaining(extensions));
      });

      it("should add one extension if the extension list is a single string", () => {
        const extensions = "nes";
        const expected = ["zip", "7z", "nes"];
        expect(
          createTestTarget().parse({ extensions }).build().extensions,
        ).toEqual(expect.arrayContaining(expected));
      });

      it("should keep the extension list unique", () => {
        const extensions = ["zip", "nes", "nes"];
        const expected = ["zip", "7z", "nes"];
        const { extensions: actual } = createTestTarget()
          .parse({ extensions })
          .build();

        expect(actual.length).toEqual(expected.length);
        expect(actual).toEqual(expect.arrayContaining(expected));
      });

      it("should always add zip and 7z", () => {
        const extensions = ["zip", "7z"];
        expect(createTestTarget().parse({}).build().extensions).toEqual(
          expect.arrayContaining(extensions),
        );
      });

      it("should be case insensitive", () => {
        const extensions = ["NES", "nes"];
        const expected = ["7z", "zip", "nes"];

        expect(
          createTestTarget().parse({ extensions }).build().extensions,
        ).toEqual(expect.arrayContaining(expected));
      });
    });
  });
});

describe("IsSystemId", () => {
  it("should return true for supported systems", () => {
    expect(isSystemId(ZRomulatorSystemId.Switch)).toBeTruthy();
  });

  it("should return false for unsupported systems", () => {
    expect(isSystemId("ps105")).toBeFalsy();
  });

  it("should return false for non strings", () => {
    expect(isSystemId(42)).toBeFalsy();
  });

  it("should return false for undefined", () => {
    expect(isSystemId(undefined)).toBeFalsy();
  });

  it("should return false for null", () => {
    expect(isSystemId(null)).toBeFalsy();
  });
});
