import { rm, unlink } from "node:fs/promises";
import { resolve } from "node:path";

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZStreamFile } from "@zthun/crumbtrail-fs";
import { type IZLogger, ZLoggerSilent } from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigGamesBuilder,
  ZRomulatorMediaBuilder,
} from "@zthun/romulator-client";
import { ZHttpCodeClient, ZHttpCodeSuccess } from "@zthun/webigail-http";
import { ZMimeTypeImage } from "@zthun/webigail-url";
import request from "supertest";
import type { Mock, Mocked } from "vitest";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { mock } from "vitest-mock-extended";

import { ZRomulatorConfigKnown } from "../config/config-known.mjs";
import {
  type IZRomulatorConfigsService,
  ZRomulatorConfigsToken,
} from "../config/configs-service.mjs";
import { ZRomulatorMediaModule } from "./media-module.mjs";

vi.mock("node:fs/promises", async () => ({
  ...(await vi.importActual("node:fs/promises")),
  unlink: vi.fn(),
}));

describe("MediaApi", () => {
  const writer = new ZStreamFile({ cache: { maxFiles: 0 } });
  const assets = resolve(__dirname, "../../.test.media-api");
  const games = resolve(assets, "games");
  const media = resolve(games, ".media");
  const endpoint = "media";

  let _target: INestApplication<any>;
  let _logger: IZLogger;
  let _config: Mocked<IZRomulatorConfigsService>;

  const nesSystemWheel = resolve(media, "nes/wheel.png");
  const nesBatman = resolve(media, "nes/covers/Batman (USA).png");
  const snesAladdin = resolve(media, "snes/videos/Aladdin (USA).mp4");

  const createTestTarget = async () => {
    const module = await Test.createTestingModule({
      imports: [ZRomulatorMediaModule],
    })
      .overrideProvider(ZLoggerToken)
      .useValue(_logger)
      .overrideProvider(ZRomulatorConfigsToken)
      .useValue(_config)
      .compile();

    _target = module.createNestApplication();
    await _target.init();

    return _target;
  };

  beforeEach(async () => {
    _logger = new ZLoggerSilent();

    const gamesConfig = new ZRomulatorConfigBuilder()
      .copy(ZRomulatorConfigKnown.games())
      .contents(new ZRomulatorConfigGamesBuilder().gamesFolder(games).build())
      .build();

    _config = mock<IZRomulatorConfigsService>();
    _config.get.mockResolvedValue(gamesConfig);
  });

  afterEach(async () => {
    await _target?.close();
  });

  beforeAll(async () => {
    await rm(assets, { recursive: true, force: true });

    await writer.write(nesSystemWheel);
    await writer.write(nesBatman);
    await writer.write(snesAladdin);
  });

  afterAll(async () => {
    await rm(assets, { recursive: true, force: true });
  });

  describe("List", () => {
    it("should list all media", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [
        new ZRomulatorMediaBuilder().from(nesBatman).build(),
        new ZRomulatorMediaBuilder().from(nesSystemWheel).build(),
        new ZRomulatorMediaBuilder().from(snesAladdin).build(),
      ];

      // Act.
      const actual = await request(target.getHttpServer()).get(`/${endpoint}`);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
      expect(actual.body.count).toEqual(expected.length);
    });
  });

  describe("CRUD", () => {
    const batman = new ZRomulatorMediaBuilder().from(nesBatman).build();
    const url = `/${endpoint}/${batman.id}`;

    describe("Read", () => {
      it("should return the media with the given id", async () => {
        // Arrange.
        const target = await createTestTarget();

        // Act.
        const actual = await request(target.getHttpServer())
          .get(url)
          .set("Accept", "application/json");

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
        expect(actual.body).toEqual(batman);
      });

      it("should detect the correct mime type", async () => {
        // Arrange.
        const target = await createTestTarget();

        // Act.
        const actual = await request(target.getHttpServer())
          .get(url)
          .set("Accept", "*/*");

        // Assert.
        expect(actual.header["content-type"]).toContain("image/png");
      });

      it("should return the media if the mime type acceptance matches", async () => {
        // Arrange.
        const target = await createTestTarget();

        // Act.
        const actual = await request(target.getHttpServer())
          .get(url)
          .set("Accept", "video/*,image/*");

        // Assert.
        expect(actual.header["content-type"]).toContain("image/png");
      });

      it("should return a 406 error if the media type does not match the target types", async () => {
        // Arrange.
        const target = await createTestTarget();

        // Act.
        const actual = await request(target.getHttpServer())
          .get(url)
          .set("Accept", "video/mp4");

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeClient.NotAcceptable);
      });

      it("should return a 404 error if no such media exists and JSON was requested", async () => {
        // Arrange.
        const target = await createTestTarget();
        const url = `/${endpoint}/lol-wut`;

        // Act.
        const actual = await request(target.getHttpServer())
          .get(url)
          .set("Accept", "application/json");

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeClient.NotFound);
      });

      it("should generate an svg of the media if no such media exists and an image was requested", async () => {
        // Arrange.
        const target = await createTestTarget();
        const url = `/${endpoint}/arcade-wheel`;

        // Act.
        const actual = await request(target.getHttpServer()).get(url);

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
        expect(actual.header["content-type"]).toEqual(ZMimeTypeImage.SVG);
      });

      it("should generate an svg of the media if no such media exists, an image was requested, and the name is not valid at all", async () => {
        // Arrange.
        const target = await createTestTarget();
        const url = `/${endpoint}/junk`;

        // Act.
        const actual = await request(target.getHttpServer()).get(url);

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
        expect(actual.header["content-type"]).toEqual(ZMimeTypeImage.SVG);
      });
    });

    describe("Delete", () => {
      it("should unlink the file", async () => {
        // Arrange.
        const _unlink = unlink as Mock;
        const target = await createTestTarget();

        // Act.
        const actual = await request(target.getHttpServer()).delete(url);

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
        expect(_unlink).toHaveBeenCalledWith(nesBatman);
      });

      it("should return a 403 error if the file cannot be deleted by the running user", async () => {
        // Arrange.
        const _unlink = unlink as Mock;
        const target = await createTestTarget();

        // Act.
        _unlink.mockRejectedValue(new Error("No Permissions"));
        const actual = await request(target.getHttpServer()).delete(url);

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeClient.Forbidden);
      });

      it("should return a 404 error if the identity does not exist", async () => {
        // Arrange.
        const target = await createTestTarget();
        const url = `/${endpoint}/lol-wut`;

        // Act.
        const actual = await request(target.getHttpServer()).delete(url);

        // Assert.
        expect(actual.status).toEqual(ZHttpCodeClient.NotFound);
      });
    });
  });
});
