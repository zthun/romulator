import type { IZCircusDriver, IZCircusSetup } from "@zthun/cirque";
import { ZCircusBy } from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { ZTestRouter } from "@zthun/fashion-boutique";
import { ZDataSourceStatic } from "@zthun/helpful-query";
import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigId,
} from "@zthun/romulator-client";
import { createMemoryHistory, type MemoryHistory } from "history";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";
import { ZRomulatorSettingsPageComponentModel } from "./settings-page.cm.mjs";
import { ZRomulatorSettingsPage } from "./settings-page.js";
import type { IZRomulatorSettingsService } from "./settings-service.mjs";
import { ZRomulatorSettingsContext } from "./settings-service.mjs";

describe("ZRomulatorSettingsPage", () => {
  const _games = new ZRomulatorConfigBuilder()
    .id(ZRomulatorConfigId.Games)
    .name("Games")
    .build();
  const _emulators = new ZRomulatorConfigBuilder()
    .id(ZRomulatorConfigId.Emulators)
    .name("Emulators")
    .build();

  let _renderer: IZCircusSetup | undefined;
  let _driver: IZCircusDriver | undefined;
  let _settings: Mocked<IZRomulatorSettingsService>;
  let _history: MemoryHistory;

  beforeEach(() => {
    _history = createMemoryHistory();

    const source = new ZDataSourceStatic([_games, _emulators]);

    _settings = mock<IZRomulatorSettingsService>();
    _settings.retrieve.mockImplementation((r) => source.retrieve(r));
    _settings.count.mockImplementation((r) => source.count(r));
  });

  afterEach(async () => {
    await _driver?.destroy?.call(_driver);
    await _renderer?.destroy?.call(_renderer);
  });

  const createTestTarget = async () => {
    const element = (
      <ZTestRouter location={_history.location} navigator={_history}>
        <ZRomulatorSettingsContext value={_settings}>
          <ZRomulatorSettingsPage />
        </ZRomulatorSettingsContext>
      </ZTestRouter>
    );

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    const target = await ZCircusBy.first(
      _driver,
      ZRomulatorSettingsPageComponentModel,
    );
    const grid = await target.grid();
    const suspense = await grid.suspense();
    await suspense.load();

    return target;
  };

  describe("Tiles", () => {
    it("should have a tile for each config returned from the settings service", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const games = await target.config(ZRomulatorConfigId.Games);
      const emulators = await target.config(ZRomulatorConfigId.Emulators);

      // Assert.
      expect(games).toBeTruthy();
      expect(emulators).toBeTruthy();
    });

    it("should navigate to an individual config page when a tile is clicked", async () => {
      // Arrange.
      const target = await createTestTarget();
      const expected = `/${ZRomulatorConfigId.Games}`;

      // Act.
      const games = await target.config(ZRomulatorConfigId.Games);
      await games.click();

      // Assert.
      expect(_history.location.pathname).toEqual(expected);
    });
  });
});
