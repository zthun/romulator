import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZGridViewComponentModel,
  ZTileComponentModel,
} from "@zthun/fashion-boutique";

export class ZRomulatorGamesPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorGamesPage-root";

  public grid(): Promise<ZGridViewComponentModel> {
    return Promise.resolve(new ZGridViewComponentModel(this.driver));
  }

  public async game(id: string): Promise<ZTileComponentModel | null> {
    const grid = await this.grid();
    return ZCircusBy.optional(grid.driver, ZTileComponentModel, id);
  }

  public async games(): Promise<ZTileComponentModel[]> {
    const grid = await this.grid();
    return ZCircusBy.all(
      grid.driver,
      ZTileComponentModel,
      ".ZRomulatorGameTile-root",
    );
  }
}
