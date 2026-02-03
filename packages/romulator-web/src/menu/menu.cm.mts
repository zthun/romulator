import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZButtonComponentModel,
  ZDialogComponentModel,
  ZListItemComponentModel,
} from "@zthun/fashion-boutique";

export class ZRomulatorMenuComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorMenu-root";

  private async listItem(
    name: string,
  ): Promise<ZListItemComponentModel | null> {
    const drawer = await this.drawer();
    const opened = await drawer.opened();

    if (!opened) {
      return null;
    }

    return ZCircusBy.first(drawer.driver, ZListItemComponentModel, name);
  }

  public systems = this.listItem.bind(this, "systems");
  public games = this.listItem.bind(this, "games");
  public jobs = this.listItem.bind(this, "jobs");
  public settings = this.listItem.bind(this, "settings");

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
