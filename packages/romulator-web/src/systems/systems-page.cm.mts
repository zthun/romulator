import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZBoxComponentModel,
  ZGridViewComponentModel,
} from "@zthun/fashion-boutique";

export class ZRomulatorSystemsPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSystemsPage-root";

  public grid(): Promise<ZGridViewComponentModel> {
    return Promise.resolve(new ZGridViewComponentModel(this.driver));
  }

  public async system(id: string): Promise<ZBoxComponentModel | null> {
    const grid = await this.grid();
    return ZCircusBy.optional(grid.driver, ZBoxComponentModel, id);
  }

  public async systems(): Promise<ZBoxComponentModel[]> {
    const grid = await this.grid();
    return ZCircusBy.all(
      grid.driver,
      ZBoxComponentModel,
      ".ZRomulatorSystemsPage-tile",
    );
  }
}
