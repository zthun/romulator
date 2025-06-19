import {
  ZCircusBy,
  type IZCircusDriver,
  type IZCircusSetup,
} from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { ZRoute, ZRouteMap, ZTestRouter } from "@zthun/fashion-boutique";
import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigGamesBuilder,
  ZRomulatorConfigId,
} from "@zthun/romulator-client";
import { createMemoryHistory, type MemoryHistory } from "history";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";
import { ZRomulatorSettingPageComponentModel } from "./setting-page.cm.mjs";
import { ZRomulatorSettingPage } from "./setting-page.js";
import {
  ZRomulatorSettingsContext,
  type IZRomulatorSettingsService,
} from "./settings-service.mjs";

describe("ZRomulatorSettingPage", () => {
  const _gamesContent = new ZRomulatorConfigGamesBuilder()
    .gamesFolder("/path/to/games")
    .mediaFolder("/path/to/media")
    .build();
  const _games = new ZRomulatorConfigBuilder()
    .id(ZRomulatorConfigId.Games)
    .contents(_gamesContent)
    .name("Games")
    .description("Games config")
    .build();

  let _history: MemoryHistory;
  let _settings: Mocked<IZRomulatorSettingsService>;
  let _renderer: IZCircusSetup;
  let _driver: IZCircusDriver;

  const createTestTarget = async () => {
    const element = (
      <ZRomulatorSettingsContext value={_settings}>
        <ZTestRouter location={_history.location} navigator={_history}>
          <ZRouteMap>
            <ZRoute path="/settings/:id" element={<ZRomulatorSettingPage />} />
          </ZRouteMap>
        </ZTestRouter>
      </ZRomulatorSettingsContext>
    );

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZRomulatorSettingPageComponentModel);
  };

  const loadTestTarget = async () => {
    const target = await createTestTarget();
    const suspense = await target.suspense();
    await suspense.load();
    return target;
  };

  beforeEach(() => {
    _settings = mock<IZRomulatorSettingsService>();
    _settings.get.mockResolvedValue(_games);

    _history = createMemoryHistory({ initialEntries: ["/settings/games"] });
  });

  afterEach(async () => {
    await _driver?.destroy?.call(_driver);
    await _renderer?.destroy?.call(_renderer);
  });

  describe("Header", () => {
    it("should set the page title to the name of the config", async () => {
      // Arrange.
      const target = await loadTestTarget();
      const card = await target.card();
      const title = await card.title();

      // Act.
      const heading = await title.heading();
      const actual = await heading?.text();

      // Assert.
      expect(actual).toEqual(_games.name);
    });

    it("should set the subheading to the description of the config", async () => {
      // Arrange.
      const target = await loadTestTarget();
      const card = await target.card();
      const title = await card.title();

      // Act.
      const subHeading = await title.subHeading();
      const actual = await subHeading?.text();

      // Assert.
      expect(actual).toEqual(_games.description);
    });
  });
});
