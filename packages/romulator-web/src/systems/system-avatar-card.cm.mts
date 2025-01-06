import { ZCircusComponentModel } from "@zthun/cirque";
import { ZCardComponentModel } from "@zthun/fashion-boutique";
import { firstDefined } from "@zthun/helpful-fn";

export class ZRomulatorSystemAvatarCardComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSystemCard-root";

  public card(): Promise<ZCardComponentModel> {
    return Promise.resolve(new ZCardComponentModel(this.driver));
  }

  public async id(): Promise<string> {
    const card = await this.card();
    const name = await card.driver.attribute("data-name");
    return firstDefined("", name);
  }
}
