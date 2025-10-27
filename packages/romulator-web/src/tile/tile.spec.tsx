import {
  ZCircusActBuilder,
  ZCircusBy,
  ZCircusKeyboardQwerty,
  type IZCircusDriver,
  type IZCircusSetup,
} from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { describe, expect, it, vi } from "vitest";
import { ZTileComponentModel } from "./tile.cm.mjs";
import type { IZTile } from "./tile.js";
import { ZTile } from "./tile.js";

describe("ZTile", () => {
  let _renderer: IZCircusSetup;
  let _driver: IZCircusDriver;

  const createTestTarget = async (props?: IZTile) => {
    const element = <ZTile {...props} />;

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZTileComponentModel);
  };

  it("should raise the onActivate event when the tile is clicked", async () => {
    // Arrange.
    const onActivate = vi.fn();
    const target = await createTestTarget({ onActivate });

    // Act.
    await target.click();

    // Assert.
    expect(onActivate).toHaveBeenCalled();
  });

  it("should raise the onActivate event when the tile has the focus and the enter key is pressed", async () => {
    // Arrange.
    const onActivate = vi.fn();
    const target = await createTestTarget({ onActivate });
    const act = new ZCircusActBuilder()
      .press(ZCircusKeyboardQwerty.tab)
      .build();
    await target.driver.perform(act);

    // Act.
    await target.enter();

    // Assert.
    expect(onActivate).toHaveBeenCalled();
  });

  it("should raise the onActivate event when the tile has the focus and the space key is pressed", async () => {
    // Arrange.
    const onActivate = vi.fn();
    const target = await createTestTarget({ onActivate });
    const act = new ZCircusActBuilder()
      .press(ZCircusKeyboardQwerty.tab)
      .build();
    await target.driver.perform(act);

    // Act.
    await target.space();

    // Assert.
    expect(onActivate).toHaveBeenCalled();
  });
});
