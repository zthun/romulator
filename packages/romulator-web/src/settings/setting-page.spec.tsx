import {
  type IZCircusDriver,
  type IZCircusSetup,
  ZCircusBy,
  ZCircusDestroy,
} from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { ZRoute, ZRouteMap, ZTestRouter } from "@zthun/fashion-boutique";
import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigGamesBuilder,
  ZRomulatorConfigGamesMetadata,
  ZRomulatorConfigId,
} from "@zthun/romulator-client";
import { createMemoryHistory, type MemoryHistory } from "history";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import { ZRomulatorSettingPageComponentModel } from "./setting-page.cm.mjs";
import { ZRomulatorSettingPage } from "./setting-page.js";
import {
  type IZRomulatorSettingsService,
  ZRomulatorSettingsContext,
} from "./settings-service.mjs";

describe("ZRomulatorSettingPage", () => {
  const _gamesContent = new ZRomulatorConfigGamesBuilder()
    .gamesFolder("/path/to/games")
    .build();
  const _gamesFolder = ZRomulatorConfigGamesMetadata.gamesFolder();
  const _games = new ZRomulatorConfigBuilder()
    .id(ZRomulatorConfigId.Games)
    .contents(_gamesContent)
    .name("Games")
    .description("Games config")
    .metadata(_gamesFolder)
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

    _history = createMemoryHistory({
      initialEntries: [`/settings/${_games.id}`],
    });
  });

  afterEach(() => ZCircusDestroy.sequential(_driver, _renderer));

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

  describe("Reset", () => {
    it("should reset the form meta when the reset button is clicked", async () => {
      // Arrange.
      const target = await loadTestTarget();
      const form = await target.form();
      const field = await form.field(_gamesFolder.id);

      // Act.
      const folder = await field.text();
      await folder?.keyboard("games");
      const reset = await form.button("reset");
      const btn = await reset.underlying();
      await btn.click();
      const actual = await folder?.value();

      // Assert.
      expect(actual).toEqual(_gamesContent.gamesFolder);
    });
  });

  describe("Save", () => {
    it("should save the form when the save button is clicked", async () => {
      // Arrange.
      const target = await loadTestTarget();
      const form = await target.form();
      const field = await form.field(_gamesFolder.id);
      const gamesFolder = "games";
      const expected = {
        contents: expect.objectContaining({ gamesFolder }),
      };

      // Act.
      const folder = await field.text();
      await folder?.clear();
      await folder?.keyboard(gamesFolder);
      const save = await form.button("submit");
      const btn = await save.underlying();
      await btn.click();

      // Assert.
      expect(_settings.update).toHaveBeenCalledWith(_games.id, expected);
    });
  });
});
