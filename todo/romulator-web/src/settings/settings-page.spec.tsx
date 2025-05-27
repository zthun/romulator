import { IZCircusDriver, IZCircusSetup, ZCircusBy } from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { afterEach, describe, expect, it } from "vitest";
import { ZRomulatorSettingsPage } from "./settings-page";
import { ZRomulatorSettingsPageComponentModel } from "./settings-page.cm.mjs";

describe("ZRomulatorSettingsPage", () => {
  let _renderer: IZCircusSetup | undefined;
  let _driver: IZCircusDriver | undefined;

  afterEach(async () => {
    await _driver?.destroy?.call(_driver);
    await _renderer?.destroy?.call(_renderer);
  });

  const createTestTarget = async () => {
    const element = <ZRomulatorSettingsPage />;

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZRomulatorSettingsPageComponentModel);
  };

  it("should render the page", async () => {
    // Arrange.

    // Act.
    const target = await createTestTarget();

    // Assert.
    expect(target).toBeTruthy();
  });
});
