import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  IZFileSystemService,
  ZFileSystemNodeBuilder,
} from "@zthun/helpful-node";
import { resolve } from "node:path";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, Mocked } from "vitest";
import { mock } from "vitest-mock-extended";
import { ZFileSystemServiceToken } from "../token/token.mjs";
import { ZRomulatorSystemsModule } from "./systems-module.mjs";

describe("SystemsApi", () => {
  const roms = "/path/to/roms";
  const endpoint = "systems";

  const nes = new ZFileSystemNodeBuilder()
    .folder()
    .path(resolve(roms, "nes"))
    .build();
  const snes = new ZFileSystemNodeBuilder()
    .folder()
    .path(resolve(roms, "snes"))
    .build();
  const folders = [nes, snes];

  let _target: INestApplication<any>;
  let _file: Mocked<IZFileSystemService>;

  beforeEach(() => {
    _file = mock<IZFileSystemService>();

    _file.search.mockResolvedValue(folders);
  });

  const createTestTarget = async () => {
    const module = await Test.createTestingModule({
      imports: [ZRomulatorSystemsModule],
    })
      .overrideProvider(ZFileSystemServiceToken)
      .useValue(_file)
      .compile();

    _target = module.createNestApplication();
    await _target.init();
    return _target;
  };

  afterEach(async () => {
    await _target.close();
  });

  describe("List", () => {
    it("should list all systems", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(`/${endpoint}`);

      // Assert.
      expect(actual).toEqual(folders);
    });
  });
});
