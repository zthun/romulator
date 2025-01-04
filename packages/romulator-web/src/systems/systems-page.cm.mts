import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import { ZGridViewComponentModel } from "@zthun/fashion-boutique";
import { ZRomulatorSystemCardComponentModel } from "./system-card.cm.mjs";

export class ZRomulatorSystemsPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSystemsPage-root";

  public grid(): Promise<ZGridViewComponentModel> {
    return Promise.resolve(new ZGridViewComponentModel(this.driver));
  }

  public async systems(): Promise<ZRomulatorSystemCardComponentModel[]> {
    const grid = await this.grid();
    return ZCircusBy.all(grid.driver, ZRomulatorSystemCardComponentModel);
  }
}
