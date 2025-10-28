import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZAlertComponentModel,
  ZBoxComponentModel,
  ZCardComponentModel,
  ZGridViewComponentModel,
  ZSuspenseComponentModel,
} from "@zthun/fashion-boutique";
import { kebabCase } from "lodash-es";
import { ZRomulatorMediaCardComponentModel } from "../media/media-card.cm.mjs";

export class ZRomulatorSystemPageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorSystemPage-root";

  public async loader(): Promise<ZSuspenseComponentModel | null> {
    return ZCircusBy.optional(
      this.driver,
      ZSuspenseComponentModel,
      "system-loading",
    );
  }

  public async loading(): Promise<boolean> {
    return (await this.loader()) != null;
  }

  public load(): Promise<void> {
    return this.driver.wait(() => this.loading().then((l) => !l));
  }

  public error(): Promise<ZAlertComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZAlertComponentModel);
  }

  public system(): Promise<ZCardComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZCardComponentModel, "system-info");
  }

  private media(name: string): Promise<ZRomulatorMediaCardComponentModel> {
    return ZCircusBy.first(
      this.driver,
      ZRomulatorMediaCardComponentModel,
      name,
    );
  }

  public controller = this.media.bind(this, "system-controller");
  public picture = this.media.bind(this, "system-picture");
  public wheel = this.media.bind(this, "system-wheel");

  private async fieldValue(key: string): Promise<string> {
    const klass = `.ZRomulatorSystemPage-${kebabCase(key)}`;
    const element = await this.driver.select(klass);

    return element.attribute("data-value", "");
  }

  public name = this.fieldValue.bind(this, "Name");
  public company = this.fieldValue.bind(this, "Company");
  public hardwareType = this.fieldValue.bind(this, "Hardware Type");
  public mediaFormat = this.fieldValue.bind(this, "Media Format");
  public contentType = this.fieldValue.bind(this, "Content Type");
  public productionStart = this.fieldValue.bind(this, "Production Start");
  public productionEnd = this.fieldValue.bind(this, "Production End");

  public games(): Promise<ZGridViewComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZGridViewComponentModel);
  }

  public game(id: string): Promise<ZBoxComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZBoxComponentModel, id);
  }
}
