import type { IZCircusDriver, IZCircusSetup } from "@zthun/cirque";
import { ZCircusBy, ZCircusDestroy } from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { ZTestRouter } from "@zthun/fashion-boutique";
import { ZDataSourceStatic } from "@zthun/helpful-query";
import {
  ZRomulatorGameBuilder,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import type { MemoryHistory } from "history";
import { createMemoryHistory } from "history";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import {
  type IZRomulatorMediaService,
  ZRomulatorMediaServiceContext,
} from "../media/media-service.js";
import { ZRomulatorGamesPageComponentModel } from "./games-page.cm.mjs";
import { ZRomulatorGamesPage } from "./games-page.js";
import type { IZRomulatorGamesService } from "./games-service.mjs";
import { ZRomulatorGamesServiceContext } from "./games-service.mjs";

describe("ZRomulatorGamesPage", () => {
  const mario = new ZRomulatorGameBuilder()
    .id("nes-mario")
    .file("/path/to/games/nes/mario.zip")
    .name("Super Mario Bros.")
    .system(ZRomulatorSystemId.Nintendo)
    .build();
  const crash = new ZRomulatorGameBuilder()
    .id("psx-crash")
    .file("/path/to/games/psx/crash.zip")
    .name("Crash Bandicoot")
    .system(ZRomulatorSystemId.PSX)
    .build();
  const games = [mario, crash];

  let _gamesService: Mocked<IZRomulatorGamesService>;
  let _mediaService: Mocked<IZRomulatorMediaService>;

  let _renderer: IZCircusSetup | undefined;
  let _driver: IZCircusDriver | undefined;
  let _history: MemoryHistory;

  afterEach(() => ZCircusDestroy.sequential(_driver, _renderer));

  beforeEach(() => {
    const source = new ZDataSourceStatic(games);

    _gamesService = mock<IZRomulatorGamesService>();
    _gamesService.retrieve.mockImplementation(source.retrieve.bind(source));
    _gamesService.count.mockImplementation(source.count.bind(source));

    _mediaService = mock<IZRomulatorMediaService>();
    _mediaService.url.mockReturnValue("/path/to/media");

    _history = createMemoryHistory();
  });

  const createTestTarget = async () => {
    const element = (
      <ZTestRouter navigator={_history} location={_history.location}>
        <ZRomulatorGamesServiceContext value={_gamesService}>
          <ZRomulatorMediaServiceContext value={_mediaService}>
            <ZRomulatorGamesPage />
          </ZRomulatorMediaServiceContext>
        </ZRomulatorGamesServiceContext>
      </ZTestRouter>
    );

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZRomulatorGamesPageComponentModel);
  };

  it("should render all games", async () => {
    // Arrange.
    const target = await createTestTarget();
    const expected = games.map((g) => g.id);

    // Act.
    const tiles = await target.games();
    const ids = tiles.map((g) => g.driver.attribute("data-name"));
    const actual = await Promise.all(ids);
    // Assert.
    expect(actual).toEqual(expect.arrayContaining(expected));
  });

  it("should navigate me to the game page when I click on one", async () => {
    // Arrange.
    const target = await createTestTarget();

    // Act.
    const system = await target.game(mario.id);
    await system?.click();

    // Assert.
    expect(_history.location.pathname).toEqual(`/games/${mario.id}`);
  });
});
