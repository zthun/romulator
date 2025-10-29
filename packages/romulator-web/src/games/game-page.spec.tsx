import {
  ZCircusBy,
  type IZCircusDriver,
  type IZCircusSetup,
} from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import {
  ZNotFound,
  ZRoute,
  ZRouteMap,
  ZTestRouter,
} from "@zthun/fashion-boutique";
import { required } from "@zthun/helpful-fn";
import {
  ZDataRequestBuilder,
  ZDataSourceStatic,
  ZFilterBinaryBuilder,
} from "@zthun/helpful-query";
import type { ZRomulatorMediaType } from "@zthun/romulator-client";
import {
  ZRomulatorGameBuilder,
  ZRomulatorGameMediaType,
  ZRomulatorPlayersBuilder,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import type { History } from "history";
import { createMemoryHistory } from "history";
import { noop } from "lodash-es";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";
import type { ZRomulatorMediaCardComponentModel } from "../media/media-card.cm.mjs";
import type { IZRomulatorMediaService } from "../media/media-service.js";
import { ZRomulatorMediaServiceContext } from "../media/media-service.js";
import { ZRomulatorGamePageComponentModel } from "./game-page.cm.mjs";
import { ZRomulatorGamePage } from "./game-page.js";
import type { IZRomulatorGamesService } from "./games-service.mjs";
import { ZRomulatorGamesServiceContext } from "./games-service.mjs";

interface ZRomulatorGamePageProps {
  history?: History;
}

describe("ZGamePage", () => {
  const mario = new ZRomulatorGameBuilder()
    .name("Super Mario Bros")
    .id("nes-mario")
    .file("/path/to/games/nes/mario.zip")
    .system(ZRomulatorSystemId.Nintendo)
    .developer("Nintendo")
    .publisher("Nintendo")
    .release("1985-11-17")
    .players(new ZRomulatorPlayersBuilder().twoPlayer().build())
    .description(
      "The Princess has been kidnapped by the evil Bowser, " +
        "and it is up to Mario and brother Luigi to save the day.\n\n" +
        "The first ever platform adventure for the Mario Brothers " +
        "has the player exploring level after level, with Bowser to " +
        "contend with as the end of level boss. Power-ups include " +
        "the Super Mushroom, which increases Mario's size and power, " +
        "the fire flower, allowing him to shoot fireballs at enemies, " +
        "and the ever important star man for a short burst of " +
        "invincibility.\n\nEach level includes a bonus section " +
        "filled with coins plus a shortcut through the level, plenty " +
        "of bad buys and obstacles to get past, and an end of " +
        "level flag, in which the higher the player grabs it, " +
        "the more points are awarded to them. Certain levels " +
        "also include warp points, which takes the player to higher levels.",
    )
    .build();

  let _driver: IZCircusDriver | undefined;
  let _renderer: IZCircusSetup | undefined;

  let _games: Mocked<IZRomulatorGamesService>;
  let _media: Mocked<IZRomulatorMediaService>;

  beforeEach(() => {
    const games = new ZDataSourceStatic([mario]);

    _games = mock<IZRomulatorGamesService>();
    _games.get.mockImplementation(async (id: string) => {
      const byId = new ZFilterBinaryBuilder()
        .subject("id")
        .equal()
        .value(id)
        .build();
      const req = new ZDataRequestBuilder().filter(byId).size(1).build();
      const [item] = await games.retrieve(req);

      return required(item);
    });

    _media = mock<IZRomulatorMediaService>();
    _media.url.mockResolvedValue("/path/to/image.png");
  });

  afterEach(async () => {
    await _driver?.destroy?.call(_driver);
    await _renderer?.destroy?.call(_renderer);
  });

  function createGameMemoryHistory(game: string): History {
    return createMemoryHistory({ initialEntries: [`/games/${game}`] });
  }

  const createTestTarget = async (props: ZRomulatorGamePageProps = {}) => {
    const { history = createGameMemoryHistory(mario.id) } = props;

    const element = (
      <ZRomulatorMediaServiceContext value={_media}>
        <ZRomulatorGamesServiceContext value={_games}>
          <ZTestRouter navigator={history} location={history.location}>
            <ZRouteMap>
              <ZRoute path="/games/:id" element={<ZRomulatorGamePage />} />
              <ZRoute path="*" element={<ZNotFound />} />
            </ZRouteMap>
          </ZTestRouter>
        </ZRomulatorGamesServiceContext>
      </ZRomulatorMediaServiceContext>
    );

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZRomulatorGamePageComponentModel);
  };

  describe("Loading", () => {
    it("should show a loading indicator while the game is loading", async () => {
      // Arrange.
      _games.get.mockReturnValue(new Promise(noop));
      const target = await createTestTarget();

      // Act.
      const actual = await target.loading();

      // Assert.
      expect(actual).toBeTruthy();
    });
  });

  describe("Error", () => {
    it("should show an error alert if the game cannot be found", async () => {
      // Arrange.
      const history = createGameMemoryHistory("does-not-exist");
      const target = await createTestTarget({ history });
      await target.load();

      // Act.
      const actual = await target.error();

      // Assert.
      expect(actual).toBeTruthy();
    });
  });

  describe("Media", () => {
    const shouldRenderMedia = async (
      expected: ZRomulatorMediaType,
      fn: (
        target: ZRomulatorGamePageComponentModel,
      ) => Promise<ZRomulatorMediaCardComponentModel | null>,
    ) => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const media = await fn(target);
      const actual = await media?.type();

      // Assert.
      expect(actual).toEqual(expected);
    };

    it("should render the back cover", async () => {
      await shouldRenderMedia(ZRomulatorGameMediaType.BackCover, (t) =>
        t.backCover(),
      );
    });

    it("should render the 3d box", async () => {
      await shouldRenderMedia(ZRomulatorGameMediaType.Box3d, (t) => t.box3d());
    });

    it("should render the front cover", async () => {
      await shouldRenderMedia(ZRomulatorGameMediaType.Cover, (t) => t.cover());
    });

    it("should render the fan art", async () => {
      await shouldRenderMedia(ZRomulatorGameMediaType.FanArt, (t) =>
        t.fanArt(),
      );
    });

    it("should render the marquee", async () => {
      await shouldRenderMedia(ZRomulatorGameMediaType.Marquee, (t) =>
        t.marquee(),
      );
    });

    it("should render the physical media", async () => {
      await shouldRenderMedia(ZRomulatorGameMediaType.PhysicalMedia, (t) =>
        t.physicalMedia(),
      );
    });

    it("should render the screenshot", async () => {
      await shouldRenderMedia(ZRomulatorGameMediaType.Screenshot, (t) =>
        t.screenshot(),
      );
    });

    it("should render the title", async () => {
      await shouldRenderMedia(ZRomulatorGameMediaType.Title, (t) => t.title());
    });
  });

  describe("Info", () => {
    async function shouldRenderInformation(
      expected: string,
      fieldFn: (target: ZRomulatorGamePageComponentModel) => Promise<string>,
    ) {
      // Arrange.
      const target = await createTestTarget();
      await target.load();

      // Act.
      const actual = await fieldFn(target);

      // Assert.
      expect(actual).toEqual(expected);
    }

    it("should render the game name", async () => {
      await shouldRenderInformation(mario.name, (t) => t.name());
    });

    it("should render the game file", async () => {
      await shouldRenderInformation(mario.file, (t) => t.file());
    });

    it("should render the game release date", async () => {
      await shouldRenderInformation(mario.release, (t) => t.release());
    });

    it("should render the game developer", async () => {
      await shouldRenderInformation(mario.developer, (t) => t.developer());
    });

    it("should render the game publisher", async () => {
      await shouldRenderInformation(mario.publisher, (t) => t.publisher());
    });
  });

  describe("Synopsis", () => {
    it("should render the game description", async () => {
      // Arrange.
      const target = await createTestTarget();
      await target.load();

      // Act.
      const actual = await target.description();

      // Assert.
      expect(actual).toEqual(mario.description);
    });
  });

  describe("System", () => {
    it("should not display while loading", async () => {
      // Arrange.
      _games.get.mockReturnValue(new Promise(noop));
      const target = await createTestTarget();

      // Act.
      const actual = await target.navigateToSystem();

      // Assert.
      expect(actual).toBeNull();
    });

    it("should navigate to the system", async () => {
      // Arrange.
      const history = createGameMemoryHistory(mario.id);
      const expected = `/systems/${mario.system}`;
      const target = await createTestTarget({ history });
      await target.load();

      // Act.
      const navigate = await target.navigateToSystem();
      await navigate?.click();

      // Assert.
      expect(history.location.pathname).toEqual(expected);
    });
  });
});
