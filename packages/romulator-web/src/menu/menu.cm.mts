import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZButtonComponentModel,
  ZDialogComponentModel,
} from "@zthun/fashion-boutique";

export class ZRomulatorMenuComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorMenu-root";

  public drawer(): Promise<ZDialogComponentModel> {
    return ZCircusBy.first(this.driver, ZDialogComponentModel, "navigation");
  }

  public button(): Promise<ZButtonComponentModel> {
    return ZCircusBy.first(this.driver, ZButtonComponentModel, "toggler");
  }

  public async open(): Promise<void> {
    const drawer = await this.drawer();

    if (await drawer.opened()) {
      return;
    }

    const button = await this.button();
    await button.click();
    await drawer.waitForOpen();
  }

  public async close(): Promise<void> {
    const drawer = await this.drawer();

    if (!(await drawer.opened())) {
      return;
    }

    await drawer.close();
    await drawer.waitForClose();
  }
}
