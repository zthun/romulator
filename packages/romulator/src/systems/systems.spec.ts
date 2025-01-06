import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  IZFileSystemService,
  ZFileSystemNodeBuilder,
} from "@zthun/helpful-node";
import {
  ZFilterBinaryBuilder,
  ZFilterSerialize,
  ZSortBuilder,
  ZSortSerialize,
} from "@zthun/helpful-query";
import {
  ZRomulatorConfigBuilder,
  ZRomulatorSystemBuilder,
} from "@zthun/romulator-models";
import { ZHttpCodeSuccess } from "@zthun/webigail-http";
import { resolve } from "node:path";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, Mocked } from "vitest";
import { mock } from "vitest-mock-extended";
import {
  IZRomulatorConfigService,
  ZRomulatorConfigsToken,
} from "../config/configs-service.mjs";
import { ZFileSystemToken } from "../file/file-system-service.mjs";
import { ZRomulatorSystemsModule } from "./systems-module.mjs";

describe("SystemsApi", () => {
  const roms = "/path/to/roms";
  const endpoint = "systems";

  const nes = new ZRomulatorSystemBuilder().nes().build();
  const snes = new ZRomulatorSystemBuilder().snes().build();

  const mediaFolder = new ZFileSystemNodeBuilder()
    .folder()
    .path(resolve(roms, ".media"))
    .build();
  const nesFolder = new ZFileSystemNodeBuilder()
    .folder()
    .path(resolve(roms, "nes"))
    .build();
  const snesFolder = new ZFileSystemNodeBuilder()
    .folder()
    .path(resolve(roms, "snes"))
    .build();
  const folders = [mediaFolder, nesFolder, snesFolder];

  let _target: INestApplication<any>;
  let _file: Mocked<IZFileSystemService>;
  let _config: Mocked<IZRomulatorConfigService>;

  beforeEach(() => {
    _file = mock<IZFileSystemService>();
    _file.search.mockResolvedValue(folders);

    _config = mock<IZRomulatorConfigService>();
    _config.read.mockResolvedValue(
      new ZRomulatorConfigBuilder().games(roms).build(),
    );
  });

  const createTestTarget = async () => {
    const module = await Test.createTestingModule({
      imports: [ZRomulatorSystemsModule],
    })
      .overrideProvider(ZFileSystemToken)
      .useValue(_file)
      .overrideProvider(ZRomulatorConfigsToken)
      .useValue(_config)
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
      const expected = [nes, snes];

      // Act.
      const actual = await request(target.getHttpServer()).get(`/${endpoint}`);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
      expect(actual.body.count).toEqual(expected.length);
    });

    it("should sort systems by name", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [snes, nes];
      const sort = new ZSortSerialize().serialize(
        new ZSortBuilder().descending("name").ascending("id").build(),
      );

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?sort=${sort}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
    });

    it("should filter systems", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [snes];
      const filter = new ZFilterSerialize().serialize(
        new ZFilterBinaryBuilder()
          .subject("name")
          .like()
          .value("Super")
          .build(),
      );

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?filter=${filter}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
    });

    it("should page the systems", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [snes];

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?page=2&size=1`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
    });

    it("should retrieve systems by short, name or id when searching", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [snes];

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?search=SnES`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
    });
  });
});
