import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZLoggerSilent, ZLogLevel } from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import { ZRomulatorConfigGamesBuilder } from "@zthun/romulator-client";
import {
  ZHttpCodeClient,
  ZHttpCodeServer,
  ZHttpCodeSuccess,
} from "@zthun/webigail-http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZRomulatorConfigDto } from "./config.mjs";
import { ZRomulatorConfigsModule } from "./configs-module.mjs";

vi.mock("node:fs/promises");

describe("ConfigsApi", () => {
  const endpoint = "configs";
  const configs = ZRomulatorConfigDto.all();
  const games = ZRomulatorConfigDto.games();

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
    _target.useGlobalPipes(new ValidationPipe({ transform: true }));
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

  describe("Update", () => {
    describe("Bad Request", () => {
      it("should return a 400 error if the contents are missing", async () => {
        // Arrange.
        const target = await createTestTarget();

        // Act.
        const actual = await request(target.getHttpServer())
          .patch(`/${endpoint}/${games.id}`)
          .send({ bar: "lol-wut" });

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeClient.BadRequest);
      });

      it("should return a 400 error if the contents are empty", async () => {
        // Arrange.
        const payload = { contents: {} };
        const target = await createTestTarget();

        // Act.
        const actual = await request(target.getHttpServer())
          .patch(`/${endpoint}/${games.id}`)
          .send(payload);

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeClient.BadRequest);
      });
    });

    describe("Not Found", () => {
      it("should return a 404 if the target config id does not exist", async () => {
        // Arrange.
        const payload = { contents: { a: 1, b: 2 } };
        const target = await createTestTarget();

        // Act.
        const actual = await request(target.getHttpServer())
          .patch(`/${endpoint}/not-a-config-id`)
          .send(payload);

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeClient.NotFound);
      });
    });

    describe("Success", () => {
      const existing = new ZRomulatorConfigGamesBuilder()
        .gamesFolder("/path/to/games/.media")
        .build();
      const existingBytes = Buffer.from(JSON.stringify(existing));
      const contents = new ZRomulatorConfigGamesBuilder()
        .mediaFolder("/path/to/games/.media")
        .build();

      beforeEach(() => {
        vi.mocked(readFile).mockResolvedValue(existingBytes);
      });

      it("should update a config with the given id", async () => {
        // Arrange.
        const next = new ZRomulatorConfigGamesBuilder()
          .copy(existing)
          .assign(contents)
          .build();
        const expected = JSON.stringify(next);
        const payload = { contents };
        const target = await createTestTarget();

        // Act.
        await request(target.getHttpServer())
          .patch(`/${endpoint}/${games.id}`)
          .send(payload);

        // Assert.
        expect(writeFile).toHaveBeenCalledWith(games.file, expected);
      });

      it("should return the updated config", async () => {
        // Arrange.
        const next = new ZRomulatorConfigGamesBuilder()
          .copy(existing)
          .assign(contents)
          .build();
        const json = JSON.stringify(next);
        const expected = games.toClient(next);

        vi.mocked(readFile)
          .mockResolvedValueOnce(existingBytes)
          .mockResolvedValueOnce(json);

        const payload = { contents };
        const target = await createTestTarget();

        // Act.
        const actual = await request(target.getHttpServer())
          .patch(`/${endpoint}/${games.id}`)
          .send(payload);

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
        expect(actual.body).toEqual(expected);
      });
    });

    describe("Error", () => {
      const contents = new ZRomulatorConfigGamesBuilder()
        .gamesFolder("/path/to/games/")
        .build();

      it("should log the error message if there is a failure creating the directory", async () => {
        // Arrange.
        const expected = "Permission Denied";
        const target = await createTestTarget();
        const payload = { contents };
        vi.mocked(mkdir).mockRejectedValue(new Error(expected));
        vi.spyOn(_logger, "log");

        // Act.
        const actual = await request(target.getHttpServer())
          .patch(`/${endpoint}/${games.id}`)
          .send(payload);

        // Assert
        expect(actual.status).toEqual(ZHttpCodeServer.InternalServerError);
        expect(_logger.log).toHaveBeenCalledWith(
          expect.objectContaining({ message: expected }),
        );
      });
    });
  });
});
