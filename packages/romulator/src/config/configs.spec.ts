import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZLoggerSilent, ZLogLevel } from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import { ZHttpCodeSuccess } from "@zthun/webigail-http";
import { readFile } from "node:fs/promises";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ZRomulatorConfigBuilder } from "./config";
import { ZRomulatorConfigGamesBuilder } from "./config-games";
import { ZRomulatorConfigsModule } from "./configs-module.mjs";

vi.mock("node:fs/promises");

describe("ConfigsApi", () => {
  const endpoint = "configs";
  const configs = ZRomulatorConfigBuilder.all();

  let _logger: ZLoggerSilent;
  let _target: INestApplication<any>;

  const createTestTarget = async () => {
    _logger = new ZLoggerSilent();

    const module = await Test.createTestingModule({
      imports: [ZRomulatorConfigsModule],
    })
      .overrideProvider(ZLoggerToken)
      .useValue(_logger)
      .compile();

    _target = module.createNestApplication();
    await _target.init();
    return _target;
  };

  afterEach(async () => {
    await _target.close();
  });

  describe("List", () => {
    it("should list all configs", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(`/${endpoint}`);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.count).toEqual(configs.length);
      expect(actual.body.data).toEqual(configs);
    });
  });

  describe("Get", () => {
    const games = new ZRomulatorConfigBuilder().games().build();

    it("should return the games config", async () => {
      // Arrange.
      const expected = new ZRomulatorConfigGamesBuilder()
        .gamesFolder("/path/to/games")
        .mediaFolder("/path/to/media")
        .build();
      const buffer = Buffer.from(JSON.stringify(expected));
      const target = await createTestTarget();
      vi.mocked(readFile).mockResolvedValue(buffer);

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}/${games.id}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.contents).toEqual(expected);
    });

    it("should return an empty contents if the config file cannot be read", async () => {
      // Arrange.
      const target = await createTestTarget();
      vi.mocked(readFile).mockRejectedValue(
        new Error("No such file or directory"),
      );

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}/${games.id}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.contents).toEqual({});
    });

    it("should log a warning that a config file has not been initialized yet", async () => {
      // Arrange.
      const expected = new Error("No such file or directory");
      const target = await createTestTarget();
      vi.mocked(readFile).mockRejectedValue(expected);
      vi.spyOn(_logger, "log");

      // Act.
      await request(target.getHttpServer()).get(`/${endpoint}/${games.id}`);

      // Assert.
      expect(_logger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          level: ZLogLevel.WARNING,
          message: expected.message,
        }),
      );
    });

    it("should return a 404 if no such config id exists", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}/config-does-not-exist`,
      );

      // Assert.
      expect(actual.status).toEqual(404);
    });
  });
});
