import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import { ZBoxComponentModel } from "@zthun/fashion-boutique";

export class ZRomulatorSettingsPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSettingsPage-root";

  public async navigate(name: string) {
    const query = `.ZRomulatorSettingsPage-tile[data-setting="${name}"]`;
    const tile = await ZCircusBy.css(this.driver, ZBoxComponentModel, query);
    await tile.click();
  }
}
