import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { afterEach, describe, expect, it } from "vitest";
import { ZRomulatorFilesModule } from "./files-module.mjs";

describe("FilesApi", () => {
  let _target: INestApplication<any>;

  const createTestTarget = async () => {
    const module = await Test.createTestingModule({
      imports: [ZRomulatorFilesModule],
    }).compile();

    _target = module.createNestApplication();
    await _target.init();
    return _target;
  };

  afterEach(async () => {
    await _target.close();
  });

  it("should successfully create the module", async () => {
    // Arrange.

    // Act.
    const target = await createTestTarget();

    // Assert.
    expect(target).toBeTruthy();
  });
});
