import {
  ZCircusActBuilder,
  ZCircusComponentModel,
  ZCircusKeyboardQwerty,
} from "@zthun/cirque";

export class ZTileComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZTile-root";

  public async click() {
    const act = new ZCircusActBuilder().click().build();
    await this.driver.perform(act);
  }

  public async enter() {
    const act = new ZCircusActBuilder()
      .press(ZCircusKeyboardQwerty.enter)
      .build();
    await this.driver.perform(act);
  }

  public async space() {
    const act = new ZCircusActBuilder()
      .press(ZCircusKeyboardQwerty.space)
      .build();
    await this.driver.perform(act);
  }
}
