import type { IZCircusDriver, IZCircusSetup } from "@zthun/cirque";
import { ZCircusBy, ZCircusDestroy } from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { ZTestRouter } from "@zthun/fashion-boutique";
import { createMemoryHistory, type MemoryHistory } from "history";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ZRomulatorMenuComponentModel } from "./menu.cm.mjs";
import { ZRomulatorMenu } from "./menu.js";

describe("ZRomulatorMenu", () => {
  let _renderer: IZCircusSetup<IZCircusDriver>;
  let _driver: IZCircusDriver;
  let _history: MemoryHistory;

  const createTestTarget = async () => {
    const element = (
      <ZTestRouter location={_history.location} navigator={_history}>
        <ZRomulatorMenu />
      </ZTestRouter>
    );

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZRomulatorMenuComponentModel);
  };

  beforeEach(() => {
    _history = createMemoryHistory();
  });

  afterEach(() => ZCircusDestroy.sequential(_driver, _renderer));

  describe("Open", () => {
    it("should open the menu when the menu is clicked", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      await target.open();
      await target.open();
      const drawer = await target.drawer();
      const actual = await drawer?.opened();

      // Assert.
      expect(actual).toBeTruthy();
    });

    it("should close the menu", async () => {
      // Arrange.
      const target = await createTestTarget();
      await target.open();

      // Act.
      await target.close();
      await target.close();
      const drawer = await target.drawer();
      const actual = await drawer.opened();

      // Assert.
      expect(actual).toBeFalsy();
    });

    it("should not have menu items if the drawer is closed", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await target.systems();

      // Assert.
      expect(actual).toBeNull();
    });
  });

  describe("Navigation", () => {
    type NavigationName = "systems" | "settings" | "jobs" | "games";

    const shouldNavigateTo = async (expected: string, name: NavigationName) => {
      // Arrange.
      const target = await createTestTarget();
      await target.open();

      // Act.
      const item = await target[name]();
      await item?.click();

      // Assert.
      expect(_history.location.pathname).toEqual(expected);
    };

    it("should navigate to the systems page", async () => {
      await shouldNavigateTo("/systems", "systems");
    });

    it("should navigate to the games page", async () => {
      await shouldNavigateTo("/games", "games");
    });

    it("should navigate to the jobs page", async () => {
      await shouldNavigateTo("/jobs", "jobs");
    });

    it("should navigate to the settings page", async () => {
      await shouldNavigateTo("/settings", "settings");
    });
  });
});
