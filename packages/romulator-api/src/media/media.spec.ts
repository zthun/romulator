import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZLoggerSilent, type IZLogger } from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import type { IZRomulatorConfigMedia } from "@zthun/romulator-client";
import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigMediaBuilder,
} from "@zthun/romulator-client";
import { ZHttpCodeSuccess } from "@zthun/webigail-http";
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

describe.skip("MediaApi", () => {
  const media = "/path/to/media";
  const endpoint = "media";

  const config = ZRomulatorConfigKnown.media().build();

  let _target: INestApplication<any>;
  let _logger: IZLogger;
  let _config: Mocked<IZRomulatorConfigsService>;

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

  beforeEach(() => {
    _logger = new ZLoggerSilent();

    _config = mock<IZRomulatorConfigsService>();
    _config.get.mockResolvedValue(
      new ZRomulatorConfigBuilder<IZRomulatorConfigMedia>()
        .copy(config)
        .contents(new ZRomulatorConfigMediaBuilder().mediaFolder(media).build())
        .build(),
    );
  });

  afterEach(async () => {
    await _target?.close();
  });

  describe("List", () => {
    it("should list all media", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [];

      // Act.
      const actual = await request(target.getHttpServer()).get(`/${endpoint}`);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
      expect(actual.body.count).toEqual(expected.length);
    });
  });
});
