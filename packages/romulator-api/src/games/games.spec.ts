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
} from "@zthun/romulator-client";
import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigGamesBuilder,
  ZRomulatorSystemId,
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
import {
  ZRomulatorConfigsToken,
  type IZRomulatorConfigsService,
} from "../config/configs-service.mjs";
import { ZRomulatorGamesModule } from "./games-module.mjs";

describe.skip("GamesApi", () => {
  const endpoint = "games";
  const assets = resolve(__dirname, "../../.test.games-api");
  const info = resolve(assets, ".info");
  const media = resolve(assets, ".media");
  const nes = resolve(assets, ZRomulatorSystemId.Nintendo);
  const megadrive = resolve(assets, ZRomulatorSystemId.MegaDrive);
  const gameMario = resolve(nes, "super-mario-bros.zip");
  const gameZelda = resolve(nes, "legend-of-zelda.nes");
  const gameStarTropics = resolve(nes, "star-tropics.7z");
  const saveZelda = resolve(nes, "legend-of-zelda.sav");
  const gameGunstarHeroes = resolve(megadrive, "gunstar-heroes.zip");
  const gameSonic = resolve(megadrive, "sonic.zip");
  const allGames = [
    gameMario,
    gameGunstarHeroes,
    gameZelda,
    gameStarTropics,
    gameSonic,
  ];
  const fileStream = new ZStreamFile({ cache: { maxFiles: 0 } });
  const folderStream = new ZStreamFolder();

  let _target: INestApplication<any>;
  let _config: Mocked<IZRomulatorConfigsService>;

  const createTestTarget = async () => {
    const module = await Test.createTestingModule({
      imports: [ZRomulatorGamesModule],
    })
      .overrideProvider(ZRomulatorConfigsToken)
      .useValue(_config)
      .overrideProvider(ZLoggerToken)
      .useValue(new ZLoggerSilent())
      .compile();

    _target = module.createNestApplication();
    await _target.init();
    return _target;
  };

  beforeEach(() => {
    const gamesConfig = new ZRomulatorConfigGamesBuilder()
      .gamesFolder(assets)
      .build();

    _config = mock<IZRomulatorConfigsService>();
    _config.get.mockResolvedValue(
      new ZRomulatorConfigBuilder<IZRomulatorConfigGames>()
        .copy(ZRomulatorConfigKnown.games())
        .contents(gamesConfig)
        .build() as Required<IZRomulatorConfig>,
    );
  });

  afterEach(async () => {
    await _target?.close();
  });

  beforeAll(async () => {
    await folderStream.write(info);
    await folderStream.write(media);

    await fileStream.write(gameMario);
    await fileStream.write(gameZelda);
    await fileStream.write(saveZelda);
    await fileStream.write(gameStarTropics);
    await fileStream.write(gameGunstarHeroes);
    await fileStream.write(gameSonic);

    await fileStream.write(
      resolve(info, `${ZRomulatorSystemId.Nintendo}.json`),
      {
        buffer: Buffer.from(
          JSON.stringify(
            [
              {
                file: gameMario,
                name: "Super Mario Bros.",
              },
              {
                file: gameZelda,
                name: "Legend of Zelda, The",
              },
              {
                file: gameStarTropics,
                name: "Star Tropics",
              },
            ],
            undefined,
            2,
          ),
        ),
      },
    );

    await fileStream.write(
      resolve(info, `${ZRomulatorSystemId.MegaDrive}.json`),
      {
        buffer: Buffer.from(
          JSON.stringify(
            [
              {
                file: gameGunstarHeroes,
                name: "Gunstar Heroes",
              },
              {
                file: gameSonic,
                name: "Sonic The Hedgehog",
              },
            ],
            undefined,
            2,
          ),
        ),
      },
    );

    await fileStream.write(resolve(info, "systems.json"), {
      buffer: Buffer.from(
        JSON.stringify(
          [
            {
              id: ZRomulatorSystemId.Nintendo,
              name: "Nintendo NES",
              extensions: ["nes"],
            },
            {
              id: ZRomulatorSystemId.MegaDrive,
              name: "Sega MegaDrive",
              extensions: ["gen", "bin"],
            },
          ],
          undefined,
          2,
        ),
      ),
    });
  });

  afterAll(async () => {
    await rm(assets, { recursive: true, force: true });
  });

  describe("List", () => {
    it("should list all games that match the system extensions", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(`/${endpoint}`);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(
        expect.arrayContaining(
          allGames.map((g) => expect.objectContaining({ file: g })),
        ),
      );
      expect(actual.body.count).toEqual(allGames.length);
    });

    it("should list all games if search is white space", async () => {
      // Arrange.
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?search=`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(
        expect.arrayContaining(
          allGames.map((file) => expect.objectContaining({ file })),
        ),
      );
    });

    it("should sort games by name", async () => {
      // Arrange.
      const target = await createTestTarget();
      const byName = new ZSortBuilder().ascending("name").build();
      const sort = new ZSortSerialize().serialize(byName);
      const expected = [
        gameGunstarHeroes,
        gameZelda,
        gameSonic,
        gameMario,
        gameStarTropics,
      ];

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?sort=${sort}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(
        expected.map((file) => expect.objectContaining({ file })),
      );
    });

    it("should filter games", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [gameMario, gameStarTropics, gameZelda];
      const bySystem = new ZFilterBinaryBuilder()
        .subject("system")
        .equal()
        .value(ZRomulatorSystemId.Nintendo)
        .build();
      const filter = new ZFilterSerialize().serialize(bySystem);

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?filter=${filter}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(
        expected.map((file) => expect.objectContaining({ file })),
      );
      expect(actual.body.count).toEqual(expected.length);
    });

    it("should page the games", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?page=2&size=1`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ file: gameSonic })]),
      );
    });

    it("should search games by name", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [gameZelda];

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?search=zeLda`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(expected);
      expect(actual.body.count).toEqual(expected.length);
    });

    it("should search games by system name", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = [gameGunstarHeroes, gameSonic];

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}?search=megadrive`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data).toEqual(
        expect.arrayContaining(
          expected.map((file) => expect.objectContaining({ file })),
        ),
      );
      expect(actual.body.count).toEqual(expected.length);
    });
  });

  describe("Get", () => {
    it("should return the game by its id", async () => {
      // Arrange.
      const target = await createTestTarget();
      const id = "nes-super-mario-bros";

      // Act.
      const actual = await request(target.getHttpServer()).get(
        `/${endpoint}/${id}`,
      );

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body).toEqual(
        expect.objectContaining({
          id,
          file: gameMario,
          system: ZRomulatorSystemId.Nintendo,
        }),
      );
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
