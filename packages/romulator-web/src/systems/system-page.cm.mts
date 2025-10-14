import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZAlertComponentModel,
  ZBoxComponentModel,
  ZCardComponentModel,
  ZGridViewComponentModel,
  ZSuspenseComponentModel,
} from "@zthun/fashion-boutique";

export class ZRomulatorSystemPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSystemPage-root";

  public async loader(): Promise<ZSuspenseComponentModel | null> {
    return ZCircusBy.optional(
      this.driver,
      ZSuspenseComponentModel,
      "system-loading",
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

  public system(): Promise<ZCardComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZCardComponentModel, "system-info");
  }

  public games(): Promise<ZGridViewComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZGridViewComponentModel);
  }

  public game(id: string): Promise<ZBoxComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZBoxComponentModel, id);
  }
}
