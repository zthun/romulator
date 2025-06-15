import type { IZCircusDriver, IZCircusSetup } from "@zthun/cirque";
import { ZCircusBy } from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { ZTestRouter } from "@zthun/fashion-boutique";
import { createMemoryHistory, type MemoryHistory } from "history";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ZRomulatorSettingsPageComponentModel } from "./settings-page.cm.mjs";
import { ZRomulatorSettingsPage } from "./settings-page.js";
import type { IZRomulatorSettingsTile } from "./settings-tile.js";
import { ZRomulatorSettingsTileBuilder } from "./settings-tile.js";

describe("ZRomulatorSettingsPage", () => {
  let _renderer: IZCircusSetup | undefined;
  let _driver: IZCircusDriver | undefined;
  let _history: MemoryHistory;

  beforeEach(() => {
    _history = createMemoryHistory();
  });

  afterEach(async () => {
    await _driver?.destroy?.call(_driver);
    await _renderer?.destroy?.call(_renderer);
  });

  const createTestTarget = async () => {
    const element = (
      <ZTestRouter location={_history.location} navigator={_history}>
        <ZRomulatorSettingsPage />
      </ZTestRouter>
    );

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZRomulatorSettingsPageComponentModel);
  };

  describe("Tiles", () => {
    const shouldNavigateToSettings = async (tile: IZRomulatorSettingsTile) => {
      // Arrange.
      const { name } = tile;
      const target = await createTestTarget();

      // Act.
      await target.navigate(name);
      const actual = _history.location.pathname.endsWith(`/${name}`);

      // Assert.
      expect(actual).toBeTruthy();
    };

    it("should navigate to the game settings", async () => {
      const tile = new ZRomulatorSettingsTileBuilder().games().build();
      await shouldNavigateToSettings(tile);
    });

    it("should navigate to the emulator settings", async () => {
      const tile = new ZRomulatorSettingsTileBuilder().emulators().build();
      await shouldNavigateToSettings(tile);
    });
  });
});
