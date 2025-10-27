import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZBoxComponentModel,
  ZGridViewComponentModel,
} from "@zthun/fashion-boutique";

export class ZRomulatorGamesPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorGamesPage-root";

  public grid(): Promise<ZGridViewComponentModel> {
    return Promise.resolve(new ZGridViewComponentModel(this.driver));
  }

  public async game(id: string): Promise<ZBoxComponentModel | null> {
    const grid = await this.grid();
    return ZCircusBy.optional(grid.driver, ZBoxComponentModel, id);
  }

  public async games(): Promise<ZBoxComponentModel[]> {
    const grid = await this.grid();
    return ZCircusBy.all(
      grid.driver,
      ZBoxComponentModel,
      ".ZRomulatorGameTile-root",
    );
  }
}
