import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZBoxComponentModel,
  ZGridViewComponentModel,
} from "@zthun/fashion-boutique";
import type { ZRomulatorConfigId } from "@zthun/romulator-client";

export class ZRomulatorSettingsPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSettingsPage-root";

  public async grid(): Promise<ZGridViewComponentModel> {
    return Promise.resolve(new ZGridViewComponentModel(this.driver));
  }

  public async config(id: ZRomulatorConfigId): Promise<ZBoxComponentModel> {
    return ZCircusBy.first(this.driver, ZBoxComponentModel, id);
  }
}
