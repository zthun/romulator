import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { IZFileSystemService } from "@zthun/crumbtrail-fs";
import { ZFileSystemNodeBuilder } from "@zthun/crumbtrail-fs";
import { ZFileSystemToken } from "@zthun/crumbtrail-nest";
import { ZLoggerSilent, type IZLogger } from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import type { IZRomulatorConfigMedia } from "@zthun/romulator-client";
import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigMediaBuilder,
  ZRomulatorMediaBuilder,
} from "@zthun/romulator-client";
import { ZHttpCodeClient, ZHttpCodeSuccess } from "@zthun/webigail-http";
import request from "supertest";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";
import { ZRomulatorConfigKnown } from "../config/config-known.mjs";
import {
  ZRomulatorConfigsToken,
  type IZRomulatorConfigsService,
} from "../config/configs-service.mjs";
import { ZRomulatorMediaModule } from "./media-module.mjs";

describe("MediaApi", () => {
  const media = "/path/to/media";
  const endpoint = "media";

  const config = ZRomulatorConfigKnown.media();

  let _target: INestApplication<any>;
  let _logger: IZLogger;
  let _config: Mocked<IZRomulatorConfigsService>;
  let _file: Mocked<IZFileSystemService>;

  const nesSystemWheel = new ZFileSystemNodeBuilder()
    .file()
    .path(`${media}/nes/wheel.png`)
    .build();
  const nesBatman = new ZFileSystemNodeBuilder()
    .file()
    .path(`${media}/nes/covers/Batman - The Video Game (USA).png`)
    .build();
  const snesAladdin = new ZFileSystemNodeBuilder()
    .file()
    .path(`${media}/snes/videos/Aladdin (USA).mp4`)
    .build();

  const createTestTarget = async () => {
    const module = await Test.createTestingModule({
      imports: [ZRomulatorMediaModule],
    })
      .overrideProvider(ZLoggerToken)
      .useValue(_logger)
      .overrideProvider(ZRomulatorConfigsToken)
      .useValue(_config)
      .overrideProvider(ZFileSystemToken)
      .useValue(_file)
      .compile();

    _target = module.createNestApplication();
    await _target.init();

    return _target;
  };

  beforeEach(() => {
    _logger = new ZLoggerSilent();

    _config = mock<IZRomulatorConfigsService>();
    _config.get.mockResolvedValue(
      new ZRomulatorConfigBuilder<IZRomulatorConfigMedia>()
        .copy(config)
        .contents(new ZRomulatorConfigMediaBuilder().mediaFolder(media).build())
        .build(),
    );

    _file = mock<IZFileSystemService>();
    _file.search.mockResolvedValue([nesSystemWheel, nesBatman, snesAladdin]);
  });

  afterEach(async () => {
    await _target?.close();
  });

  describe("List", () => {
    it("should list all media", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [
        new ZRomulatorMediaBuilder().from(nesSystemWheel.path).build(),
        new ZRomulatorMediaBuilder().from(nesBatman.path).build(),
        new ZRomulatorMediaBuilder().from(snesAladdin.path).build(),
      ];

      // Act.
      const actual = await request(target.getHttpServer()).get(`/${endpoint}`);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
      expect(actual.body.count).toEqual(expected.length);
    });
  });

  describe("Get", () => {
    const media = new ZRomulatorMediaBuilder().from(nesBatman.path).build();
    const url = `/${endpoint}/${media.id}`;

    it("should return the media with the given id", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer())
        .get(url)
        .set("Accept", "application/json");

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body).toEqual(media);
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

    it("should return a 404 error if no such media exists", async () => {
      // Arrange.
      const target = await createTestTarget();
      const url = `/${endpoint}/lol-wut`;

      // Act.
      const actual = await request(target.getHttpServer()).get(url);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeClient.NotFound);
    });
  });
});
