import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZGridViewComponentModel,
  ZTileComponentModel,
} from "@zthun/fashion-boutique";

export class ZRomulatorJobsPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorJobsPage-root";

  public grid(): Promise<ZGridViewComponentModel> {
    return ZCircusBy.first(this.driver, ZGridViewComponentModel);
  }

  public async load() {
    const grid = await this.grid();
    const suspense = await grid.suspense();
    await suspense.load();

    return grid;
  }

  public async jobs(): Promise<ZTileComponentModel[]> {
    const grid = await this.load();

    return ZCircusBy.all(
      grid.driver,
      ZTileComponentModel,
      ".ZRomulatorJobTile-root",
    );
  }
}
