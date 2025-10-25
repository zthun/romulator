import { describe, expect, it } from "vitest";
import {
  isSystemContentType,
  ZRomulatorSystemContentType,
} from "./system-content-type.mjs";
import {
  isSystemHardwareType,
  ZRomulatorSystemHardwareType,
} from "./system-hardware-type.mjs";
import { isSystemId, ZRomulatorSystemId } from "./system-id.mjs";
import {
  isSystemMediaFormat,
  ZRomulatorSystemMediaFormat,
} from "./system-media-format-type.mjs";
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
        const expected = [".7z", ".nes", ".zip"];
        expect(
          createTestTarget().parse({ extensions }).build().extensions,
        ).toEqual(expect.arrayContaining(expected));
      });

      it("should keep the extensions if the extension list is not an array", () => {
        const extensions = [".7z", ".nes", ".zip"];
        expect(
          createTestTarget().parse({ extensions }).build().extensions,
        ).toEqual(expect.arrayContaining(extensions));
      });

      it("should add one extension if the extension list is a single string", () => {
        const extensions = "nes";
        const expected = [".zip", ".7z", ".nes"];
        expect(
          createTestTarget().parse({ extensions }).build().extensions,
        ).toEqual(expect.arrayContaining(expected));
      });

      it("should keep the extension list unique", () => {
        const extensions = ["zip", "nes", "nes"];
        const expected = [".zip", ".7z", ".nes"];
        const { extensions: actual } = createTestTarget()
          .parse({ extensions })
          .build();

        expect(actual.length).toEqual(expected.length);
        expect(actual).toEqual(expect.arrayContaining(expected));
      });

      it("should always add zip and 7z", () => {
        const extensions = [".zip", ".7z"];
        expect(createTestTarget().parse({}).build().extensions).toEqual(
          expect.arrayContaining(extensions),
        );
      });

      it("should be case insensitive", () => {
        const extensions = ["NES", "nes"];
        const expected = [".7z", ".zip", ".nes"];

        expect(
          createTestTarget().parse({ extensions }).build().extensions,
        ).toEqual(expect.arrayContaining(expected));
      });
    });

    describe("Classifications", () => {
      const hardwareType = ZRomulatorSystemHardwareType.VirtualMachine;
      const mediaFormat = ZRomulatorSystemMediaFormat.FloppyDisk;
      const contentType = ZRomulatorSystemContentType.Folder;

      it("should keep all classifications if there is no classification", () => {
        // Arrange.
        const target = createTestTarget();

        // Act.
        const system = target
          .hardware(hardwareType)
          .mediaFormat(mediaFormat)
          .contentType(contentType)
          .parse({})
          .build();
        const { classification } = system;
        const {
          hardwareType: actualHardwareType,
          mediaFormat: actualMediaFormat,
          contentType: actualContentType,
        } = classification;

        // Assert.
        expect(actualHardwareType).toEqual(hardwareType);
        expect(actualMediaFormat).toEqual(mediaFormat);
        expect(actualContentType).toEqual(contentType);
      });

      it("should keep all classifications if classification is not an object", () => {
        // Arrange.
        const target = createTestTarget();

        // Act.
        const system = target
          .hardware(hardwareType)
          .mediaFormat(mediaFormat)
          .contentType(contentType)
          .parse({ classification: "lol-wut" })
          .build();
        const { classification } = system;
        const {
          hardwareType: actualHardwareType,
          mediaFormat: actualMediaFormat,
          contentType: actualContentType,
        } = classification;

        // Assert.
        expect(actualHardwareType).toEqual(hardwareType);
        expect(actualMediaFormat).toEqual(mediaFormat);
        expect(actualContentType).toEqual(contentType);
      });

      describe("HardwareType", () => {
        it("should keep the original value if the target does not exist", () => {
          const classification = { mediaFormat, contentType };

          expect(
            createTestTarget()
              .hardware(hardwareType)
              .parse({ classification })
              .build().classification?.hardwareType,
          ).toEqual(hardwareType);
        });

        it("should keep the original value if the target is now a valid type", () => {
          const classification = {
            hardwareType: "lol-wut",
          };

          expect(
            createTestTarget()
              .hardware(hardwareType)
              .parse({ classification })
              .build().classification?.hardwareType,
          ).toEqual(hardwareType);
        });

        it("should set the value", () => {
          const expected = ZRomulatorSystemHardwareType.Accessory;
          const classification = { hardwareType: expected };
          expect(
            createTestTarget().parse({ classification }).build().classification
              ?.hardwareType,
          ).toEqual(expected);
        });
      });

      describe("MediaFormat", () => {
        it("should keep the original value if the target does not exist", () => {
          const classification = { hardwareType, contentType };

          expect(
            createTestTarget()
              .mediaFormat(mediaFormat)
              .parse({ classification })
              .build().classification?.mediaFormat,
          ).toEqual(mediaFormat);
        });

        it("should keep the original value if the target is now a valid type", () => {
          const classification = {
            mediaFormat: "lol-wut",
          };

          expect(
            createTestTarget()
              .mediaFormat(mediaFormat)
              .parse({ classification })
              .build().classification?.mediaFormat,
          ).toEqual(mediaFormat);
        });

        it("should set the value", () => {
          const expected = ZRomulatorSystemMediaFormat.Cd;
          const classification = { mediaFormat: expected };
          expect(
            createTestTarget().parse({ classification }).build().classification
              ?.mediaFormat,
          ).toEqual(expected);
        });
      });

      describe("ContentType", () => {
        it("should keep the original value if the target does not exist", () => {
          const classification = { hardwareType, mediaFormat };

          expect(
            createTestTarget()
              .contentType(contentType)
              .parse({ classification })
              .build().classification?.contentType,
          ).toEqual(contentType);
        });

        it("should keep the original value if the target is now a valid type", () => {
          const classification = {
            contentType: "lol-wut",
          };

          expect(
            createTestTarget()
              .contentType(contentType)
              .parse({ classification })
              .build().classification?.contentType,
          ).toEqual(contentType);
        });

        it("should set the value", () => {
          const expected = ZRomulatorSystemContentType.File;
          const classification = { contentType: expected };
          expect(
            createTestTarget().parse({ classification }).build().classification
              ?.contentType,
          ).toEqual(expected);
        });
      });
    });

    describe("ProductionYears", () => {
      const start = 1983;
      const end = 1989;

      it("should keep the production years if the candidate does not have them", () => {
        const expected = { start, end };

        expect(
          createTestTarget().production(start, end).parse({}).build()
            .productionYears,
        ).toEqual(expected);
      });

      it("should keep the production years if the start is not a number", () => {
        const productionYears = { start: "not-a-number", end };

        expect(
          createTestTarget()
            .production(start, end)
            .parse({ productionYears })
            .build().productionYears,
        ).toEqual({ start, end });
      });

      it("should keep the production years if the end is not a number", () => {
        const productionYears = { start, end: "not-a-number" };

        expect(
          createTestTarget()
            .production(start, end)
            .parse({ productionYears })
            .build().productionYears,
        ).toEqual({ start, end });
      });

      it("should set the production years", () => {
        const productionYears = { start: 1985, end: 1993 };

        expect(
          createTestTarget().parse({ productionYears }).build().productionYears,
        ).toEqual(productionYears);
      });

      it("should update the start but keep the original end if the end is not provided", () => {
        const expectedStart = 1990;
        const productionYears = { start: expectedStart };

        expect(
          createTestTarget()
            .production(start, end)
            .parse({ productionYears })
            .build().productionYears,
        ).toEqual({ start: expectedStart, end });
      });

      it("should update the end but keep the original start if the start is not provided", () => {
        const expectedEnd = 1995;
        const productionYears = { end: expectedEnd };

        expect(
          createTestTarget()
            .production(start, end)
            .parse({ productionYears })
            .build().productionYears,
        ).toEqual({ start, end: expectedEnd });
      });
    });
  });
});

describe("IsSystemId", () => {
  it("should return true for supported values", () => {
    expect(isSystemId(ZRomulatorSystemId.Switch)).toBeTruthy();
  });

  it("should return false for unsupported values", () => {
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

describe("IsSystemContentType", () => {
  it("should return true for supported values", () => {
    expect(isSystemContentType(ZRomulatorSystemContentType.Disk)).toBeTruthy();
  });

  it("should return false for unsupported values", () => {
    expect(isSystemContentType("cloud")).toBeFalsy();
  });

  it("should return false for non strings", () => {
    expect(isSystemContentType(42)).toBeFalsy();
  });

  it("should return false for undefined", () => {
    expect(isSystemContentType(undefined)).toBeFalsy();
  });

  it("should return false for null", () => {
    expect(isSystemContentType(null)).toBeFalsy();
  });
});

describe("IsSystemHardwareType", () => {
  it("should return true for supported values", () => {
    expect(
      isSystemHardwareType(ZRomulatorSystemHardwareType.Flipper),
    ).toBeTruthy();
  });

  it("should return false for unsupported values", () => {
    expect(isSystemHardwareType("toaster")).toBeFalsy();
  });

  it("should return false for non strings", () => {
    expect(isSystemHardwareType(42)).toBeFalsy();
  });

  it("should return false for undefined", () => {
    expect(isSystemHardwareType(undefined)).toBeFalsy();
  });

  it("should return false for null", () => {
    expect(isSystemHardwareType(null)).toBeFalsy();
  });
});

describe("IsSystemMediaFormat", () => {
  it("should return true for supported values", () => {
    expect(
      isSystemMediaFormat(ZRomulatorSystemMediaFormat.FloppyDisk),
    ).toBeTruthy();
  });

  it("should return false for unsupported values", () => {
    expect(isSystemMediaFormat("tape")).toBeFalsy();
  });

  it("should return false for non strings", () => {
    expect(isSystemMediaFormat(42)).toBeFalsy();
  });

  it("should return false for undefined", () => {
    expect(isSystemMediaFormat(undefined)).toBeFalsy();
  });

  it("should return false for null", () => {
    expect(isSystemMediaFormat(null)).toBeFalsy();
  });
});
