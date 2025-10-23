import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZStreamFile, ZStreamFolder } from "@zthun/crumbtrail-fs";
import {
  ZFilterBinaryBuilder,
  ZFilterSerialize,
  ZSortBuilder,
  ZSortSerialize,
} from "@zthun/helpful-query";
import { ZLoggerSilent } from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import type {
  IZRomulatorConfig,
  IZRomulatorConfigGames,
  IZRomulatorSystem,
} from "@zthun/romulator-client";
import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigGamesBuilder,
  ZRomulatorSystemBuilder,
  ZRomulatorSystemContentType,
  ZRomulatorSystemHardwareType,
  ZRomulatorSystemId,
  ZRomulatorSystemMediaFormatType,
} from "@zthun/romulator-client";
import { ZHttpCodeClient, ZHttpCodeSuccess } from "@zthun/webigail-http";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import request from "supertest";
import type { Mocked } from "vitest";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { mock } from "vitest-mock-extended";
import { ZRomulatorConfigKnown } from "../config/config-known.mjs";
import type { IZRomulatorConfigsService } from "../config/configs-service.mjs";
import { ZRomulatorConfigsToken } from "../config/configs-service.mjs";
import { ZRomulatorSystemsModule } from "./systems-module.mjs";

describe("SystemsApi", () => {
  const fileWriter = new ZStreamFile();
  const folderWriter = new ZStreamFolder();

  const assets = resolve(__dirname, "../../.test.systems-api");
  const games = resolve(assets, "games");
  const media = resolve(games, ".media");
  const info = resolve(games, ".info");

  const arcade = resolve(games, "arcade");
  const nes = resolve(games, "nes");
  const snes = resolve(games, "snes");
  const unsupported = resolve(games, "unsupported");

  const nesInfo = new ZRomulatorSystemBuilder()
    .id(ZRomulatorSystemId.Nintendo)
    .name("Nintendo NES")
    .hardware(ZRomulatorSystemHardwareType.Console)
    .mediaFormat(ZRomulatorSystemMediaFormatType.Cartridge)
    .contentType(ZRomulatorSystemContentType.ReadOnlyMemory)
    .production(1983, 1995)
    .extension("nes")
    .extension("fds")
    .extension("fig")
    .extension("bin")
    .extension("unf")
    .build();

  const endpoint = "systems";

  let _target: INestApplication<any>;
  let _config: Mocked<IZRomulatorConfigsService>;

  beforeEach(async () => {
    _config = mock<IZRomulatorConfigsService>();
    _config.get.mockResolvedValue(
      new ZRomulatorConfigBuilder<IZRomulatorConfigGames>()
        .copy(ZRomulatorConfigKnown.games())
        .contents(new ZRomulatorConfigGamesBuilder().gamesFolder(games).build())
        .build() as Required<IZRomulatorConfig>,
    );

    await fileWriter.write(resolve(info, "systems.json"), {
      buffer: Buffer.from(JSON.stringify(nesInfo)),
    });
  });

  afterEach(async () => {
    await _target.close();
  });

  beforeAll(async () => {
    await rm(assets, { recursive: true, force: true });

    await folderWriter.write(media);
    await folderWriter.write(info);
    await folderWriter.write(arcade);
    await folderWriter.write(nes);
    await folderWriter.write(snes);
    await folderWriter.write(unsupported);
  });

  afterAll(async () => {
    await rm(assets, { recursive: true, force: true });
  });

  const createTestTarget = async () => {
    const module = await Test.createTestingModule({
      imports: [ZRomulatorSystemsModule],
    })
      .overrideProvider(ZLoggerToken)
      .useValue(new ZLoggerSilent())
      .overrideProvider(ZRomulatorConfigsToken)
      .useValue(_config)
      .compile();

    _target = module.createNestApplication();
    await _target.init();
    return _target;
  };

  describe("List", () => {
    it("should list all systems", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [
        ZRomulatorSystemId.Arcade,
        ZRomulatorSystemId.Nintendo,
        ZRomulatorSystemId.SuperNintendo,
      ];

      // Act.
      const actual = await request(target.getHttpServer()).get(`/${endpoint}`);
      const systems = actual.body.data.map((s: IZRomulatorSystem) => s.id);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(systems).toEqual(expected);
      expect(actual.body.count).toEqual(expected.length);
    });

    it("should sort systems by name", async () => {
      // Arrange.
      const target = await createTestTarget();
      const sort = new ZSortSerialize().serialize(
        new ZSortBuilder().descending("name").ascending("id").build(),
      );

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?sort=${sort}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual([
        expect.objectContaining({ id: ZRomulatorSystemId.Nintendo }),
        expect.objectContaining({ id: ZRomulatorSystemId.Arcade }),
        expect.objectContaining({ id: ZRomulatorSystemId.SuperNintendo }),
      ]);
    });

    it("should filter systems", async () => {
      // Arrange.
      const target = await createTestTarget();
      const filter = new ZFilterSerialize().serialize(
        new ZFilterBinaryBuilder().subject("name").like().value("NE").build(),
      );

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?filter=${filter}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: ZRomulatorSystemId.Nintendo }),
        ]),
      );
    });

    it("should page the systems", async () => {
      // Arrange.
      const target = await createTestTarget();
      const sort = new ZSortSerialize().serialize(
        new ZSortBuilder().descending("id").build(),
      );

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?page=3&size=1&sort=${sort}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: ZRomulatorSystemId.Arcade }),
        ]),
      );
      expect(actual.body.count).toEqual(3);
    });

    it("should retrieve systems by name or id when searching", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?search=nES`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: ZRomulatorSystemId.Nintendo }),
          expect.objectContaining({ id: ZRomulatorSystemId.SuperNintendo }),
        ]),
      );
    });
  });

  describe("Get", () => {
    it("should return the system by its id", async () => {
      // Arrange.
      const target = await createTestTarget();
      const url = `/${endpoint}/${ZRomulatorSystemId.Arcade}`;

      // Act.
      const actual = await request(target.getHttpServer()).get(url);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body).toEqual(
        expect.objectContaining({ id: ZRomulatorSystemId.Arcade }),
      );
    });

    it("should return the system with just the id if the systems.json file does not exist", async () => {
      // Arrange.
      await rm(resolve(info, "systems.json"), { recursive: true, force: true });
      const target = await createTestTarget();
      const expected = new ZRomulatorSystemBuilder()
        .id(ZRomulatorSystemId.Nintendo)
        .build();
      const url = `/${endpoint}/${expected.id}`;

      // Act.
      const actual = await request(target.getHttpServer()).get(url);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body).toEqual(expected);
    });

    it("should return the system with just the id if the systems.json is corrupted", async () => {
      // Arrange.
      await fileWriter.write(resolve(info, "systems.json"), {
        buffer: Buffer.from("This file is garbage now"),
      });

      const target = await createTestTarget();
      const expected = new ZRomulatorSystemBuilder()
        .id(ZRomulatorSystemId.Nintendo)
        .build();
      const url = `/${endpoint}/${expected.id}`;

      // Act.
      const actual = await request(target.getHttpServer()).get(url);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body).toEqual(expected);
    });

    it("should return a 404 if the system is not supported", async () => {
      // Arrange.
      const target = await createTestTarget();
      const url = `/${endpoint}/lol-wut`;

      // Act.
      const actual = await request(target.getHttpServer()).get(url);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeClient.NotFound);
    });

    it("should return a 404 if the system is supported but is not in the games folder", async () => {
      // Arrange.
      const target = await createTestTarget();
      const url = `/${endpoint}/${ZRomulatorSystemId.Nintendo64}`;

      // Act.
      const actual = await request(target.getHttpServer()).get(url);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeClient.NotFound);
    });
  });
});
