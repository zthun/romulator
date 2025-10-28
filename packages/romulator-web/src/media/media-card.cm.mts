import { ZCircusComponentModel } from "@zthun/cirque";
import { ZRomulatorSystemMediaType } from "@zthun/romulator-client";

export class ZRomulatorMediaCardComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorMediaCard-root";

  public type() {
    return this.driver.attribute<ZRomulatorSystemMediaType>(
      "data-type",
      ZRomulatorSystemMediaType.Picture,
    );
  }

  public identifier() {
    return this.driver.attribute<string>("data-identifier", "");
  }
}
