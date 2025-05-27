import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZButtonComponentModel,
  ZGridViewComponentModel,
} from "@zthun/fashion-boutique";
import { required } from "@zthun/helpful-fn";
import { ZRomulatorSystemAvatarCardComponentModel } from "./system-avatar-card.cm.mjs";

export class ZRomulatorSystemsPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSystemsPage-root";

  public grid(): Promise<ZGridViewComponentModel> {
    return Promise.resolve(new ZGridViewComponentModel(this.driver));
  }

  public async system(
    id: string,
  ): Promise<ZRomulatorSystemAvatarCardComponentModel | null> {
    const grid = await this.grid();
    return ZCircusBy.optional(
      grid.driver,
      ZRomulatorSystemAvatarCardComponentModel,
      id,
    );
  }

  public async systems(): Promise<ZRomulatorSystemAvatarCardComponentModel[]> {
    const grid = await this.grid();
    return ZCircusBy.all(grid.driver, ZRomulatorSystemAvatarCardComponentModel);
  }

  public async more(id: string): Promise<ZButtonComponentModel> {
    const system = await this.system(id);
    const card = await system?.card();
    const footer = await required(card?.footer());

    return ZCircusBy.first(footer, ZButtonComponentModel, "more");
  }
}
