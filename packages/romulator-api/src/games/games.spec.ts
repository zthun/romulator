import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  ZFileSystemNodeBuilder,
  type IZFileSystemService,
} from "@zthun/crumbtrail-fs";
import { ZFileSystemToken } from "@zthun/crumbtrail-nest";
import {
  ZFilterBinaryBuilder,
  ZFilterSerialize,
  ZSortBuilder,
  ZSortSerialize,
} from "@zthun/helpful-query";
import type {
  IZRomulatorConfig,
  IZRomulatorConfigGames,
} from "@zthun/romulator-client";
import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigGamesBuilder,
  ZRomulatorGameBuilder,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import { ZHttpCodeClient, ZHttpCodeSuccess } from "@zthun/webigail-http";
import { kebabCase } from "lodash-es";
import { basename, extname, resolve } from "node:path";
import request from "supertest";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";
import { ZRomulatorConfigKnown } from "../config/config-known.mjs";
import {
  ZRomulatorConfigsToken,
  type IZRomulatorConfigsService,
} from "../config/configs-service.mjs";
import { ZRomulatorGamesModule } from "./games-module.mjs";

describe("GamesApi", () => {
  const games = "/path/to/games";
  const endpoint = "games";

  const config = ZRomulatorConfigKnown.games();

  const battletoadsNode = new ZFileSystemNodeBuilder()
    .file()
    .path(resolve(games, "nes", "Battletoads (USA).zip"))
    .build();
  const actRaiserNode = new ZFileSystemNodeBuilder()
    .file()
    .path(resolve(games, "snes", "ActRaiser (USA).zip"))
    .build();

  const nodes = [battletoadsNode, actRaiserNode];

  const battletoadsGame = new ZRomulatorGameBuilder()
    .id(
      `${ZRomulatorSystemId.Nintendo}-${kebabCase(
        basename(battletoadsNode.path, extname(battletoadsNode.path)),
      )}`,
    )
    .system(ZRomulatorSystemId.Nintendo)
    .name(basename(battletoadsNode.path, extname(battletoadsNode.path)))
    .file(battletoadsNode.path)
    .build();

  const actRaiserGame = new ZRomulatorGameBuilder()
    .id(
      `${ZRomulatorSystemId.SuperNintendo}-${kebabCase(
        basename(actRaiserNode.path, extname(actRaiserNode.path)),
      )}`,
    )
    .system(ZRomulatorSystemId.SuperNintendo)
    .name(basename(actRaiserNode.path, extname(actRaiserNode.path)))
    .file(actRaiserNode.path)
    .build();

  let _target: INestApplication<any>;
  let _file: Mocked<IZFileSystemService>;
  let _config: Mocked<IZRomulatorConfigsService>;

  const createTestTarget = async () => {
    const module = await Test.createTestingModule({
      imports: [ZRomulatorGamesModule],
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

  beforeEach(() => {
    _file = mock<IZFileSystemService>();
    _file.search.mockResolvedValue(nodes);

    _config = mock<IZRomulatorConfigsService>();
    _config.get.mockResolvedValue(
      new ZRomulatorConfigBuilder<IZRomulatorConfigGames>()
        .copy(config)
        .contents(new ZRomulatorConfigGamesBuilder().gamesFolder(games).build())
        .build() as Required<IZRomulatorConfig>,
    );
  });

  afterEach(async () => {
    await _target?.close();
  });

  describe("List", () => {
    it("should list all games", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [battletoadsGame, actRaiserGame];

      // Act.
      const actual = await request(target.getHttpServer()).get(`/${endpoint}`);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
      expect(actual.body.count).toEqual(expected.length);
    });

    it("should list all games if search is white space", async () => {
      // Arrange.
      // Arrange.
      const target = await createTestTarget();
      const expected = [battletoadsGame, actRaiserGame];

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?search=`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
    });

    it("should sort games by name", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [battletoadsGame, actRaiserGame];
      const sort = new ZSortSerialize().serialize(
        new ZSortBuilder().descending("name").build(),
      );

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?sort=${sort}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
    });

    it("should filter games", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [actRaiserGame];
      const filter = new ZFilterSerialize().serialize(
        new ZFilterBinaryBuilder()
          .subject("system")
          .equal()
          .value(ZRomulatorSystemId.SuperNintendo)
          .build(),
      );

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?filter=${filter}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
      expect(actual.body.count).toEqual(1);
    });

    it("should page the games", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [actRaiserGame];

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?page=2&size=1`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
      expect(actual.body.count).toEqual(nodes.length);
    });

    it("should search games by name", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [battletoadsGame];

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?search=battle`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
      expect(actual.body.count).toEqual(expected.length);
    });

    it("should search games by system name", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [actRaiserGame];

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?search=super%20nintendo`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
      expect(actual.body.count).toEqual(expected.length);
    });
  });

  describe("Get", () => {
    it("should return the game by its id", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}/${battletoadsGame.id}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body).toEqual(battletoadsGame);
    });

    it("should return a 404 if the game does not exist", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}/lol-wut`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeClient.NotFound);
    });
  });
});
