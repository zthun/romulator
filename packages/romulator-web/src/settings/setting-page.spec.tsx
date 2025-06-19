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

  beforeEach(() => {
    _settings = mock<IZRomulatorSettingsService>();
    _settings.get.mockResolvedValue(_games);

    _history = createMemoryHistory({ initialEntries: ["/settings/games"] });
  });

  afterEach(async () => {
    await _driver?.destroy?.call(_driver);
    await _renderer?.destroy?.call(_renderer);
  });

  it("should render the page", async () => {
    // Arrange.

    // Act.
    const target = await createTestTarget();

    // Assert.
    expect(target).toBeTruthy();
  });
});
