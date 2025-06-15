import type { IZCircusDriver, IZCircusSetup } from "@zthun/cirque";
import { ZCircusBy } from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { afterEach, describe, expect, it } from "vitest";
import { ZRomulatorMenuComponentModel } from "./menu.cm.mjs";
import { ZRomulatorMenu } from "./menu.js";

describe("ZRomulatorMenu", () => {
  let _renderer: IZCircusSetup<IZCircusDriver>;
  let _driver: IZCircusDriver;

  const createTestTarget = async () => {
    const element = <ZRomulatorMenu />;

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZRomulatorMenuComponentModel);
  };

  afterEach(async () => {
    await _driver?.destroy?.call(_driver);
    await _renderer?.destroy?.call(_renderer);
  });

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
  });
});
