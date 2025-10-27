import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZGridViewComponentModel,
  ZTileComponentModel,
} from "@zthun/fashion-boutique";

export class ZRomulatorSystemsPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSystemsPage-root";

  public grid(): Promise<ZGridViewComponentModel> {
    return Promise.resolve(new ZGridViewComponentModel(this.driver));
  }

  public async system(id: string): Promise<ZTileComponentModel | null> {
    const grid = await this.grid();
    return ZCircusBy.optional(grid.driver, ZTileComponentModel, id);
  }

  public async systems(): Promise<ZTileComponentModel[]> {
    const grid = await this.grid();
    return ZCircusBy.all(
      grid.driver,
      ZTileComponentModel,
      ".ZRomulatorSystemsPage-tile",
    );
  }
}
