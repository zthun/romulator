import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZAlertComponentModel,
  ZSuspenseComponentModel,
} from "@zthun/fashion-boutique";

export class ZRomulatorGamePageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorGamePage-root";

  public async loader(): Promise<ZSuspenseComponentModel | null> {
    return ZCircusBy.optional(
      this.driver,
      ZSuspenseComponentModel,
      "game-loading",
    );
  }

  public async loading(): Promise<boolean> {
    return (await this.loader()) != null;
  }

  public load(): Promise<void> {
    return this.driver.wait(() => this.loading().then((l) => !l));
  }

  public error(): Promise<ZAlertComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZAlertComponentModel);
  }
}
