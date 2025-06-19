import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZCardComponentModel,
  ZFormComponentModel,
  ZSuspenseComponentModel,
} from "@zthun/fashion-boutique";

export class ZRomulatorSettingPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSettingPage-root";

  public card(): Promise<ZCardComponentModel> {
    return ZCircusBy.first(this.driver, ZCardComponentModel);
  }

  public suspense(): Promise<ZSuspenseComponentModel> {
    return ZCircusBy.first(this.driver, ZSuspenseComponentModel);
  }

  public form(): Promise<ZFormComponentModel> {
    return ZCircusBy.first(this.driver, ZFormComponentModel);
  }
}
