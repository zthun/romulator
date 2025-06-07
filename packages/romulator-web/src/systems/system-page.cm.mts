import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZAlertComponentModel,
  ZSuspenseComponentModel,
} from "@zthun/fashion-boutique";
import { ZRomulatorSystemAvatarCardComponentModel } from "./system-avatar-card.cm.mjs";

export class ZRomulatorSystemPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSystemPage-root";

  public async loader(): Promise<ZSuspenseComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZSuspenseComponentModel);
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

  public system(): Promise<ZRomulatorSystemAvatarCardComponentModel | null> {
    return ZCircusBy.optional(
      this.driver,
      ZRomulatorSystemAvatarCardComponentModel,
    );
  }
}
