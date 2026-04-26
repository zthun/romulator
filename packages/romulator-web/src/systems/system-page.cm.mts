import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZAlertComponentModel,
  ZBoxComponentModel,
  ZCardComponentModel,
  ZGridViewComponentModel,
  ZSuspenseComponentModel,
} from "@zthun/fashion-boutique";
import { firstDefined } from "@zthun/helpful-fn";
import { ZRomulatorSystemMediaType } from "@zthun/romulator-client";
import { kebabCase } from "lodash-es";

import { ZRomulatorMediaCardComponentModel } from "../media/media-card.cm.mjs";

const { Controller, Picture, Wheel } = ZRomulatorSystemMediaType;

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

  public info(): Promise<ZCardComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZCardComponentModel, "info");
  }

  private media(
    type: ZRomulatorSystemMediaType,
  ): Promise<ZRomulatorMediaCardComponentModel> {
    return ZCircusBy.first(
      this.driver,
      ZRomulatorMediaCardComponentModel,
      type,
    );
  }

  public controller = this.media.bind(this, Controller);
  public picture = this.media.bind(this, Picture);
  public wheel = this.media.bind(this, Wheel);

  private async field(key: string): Promise<string> {
    const info = await this.info();
    const klass = `.ZRomulatorSystemPage-${kebabCase(key)}`;
    const element = await info?.driver.select(klass);
    const value = await element?.attribute("data-value", "");
    return firstDefined("", value);
  }

  public name = this.field.bind(this, "Name");
  public company = this.field.bind(this, "Company");
  public hardwareType = this.field.bind(this, "Hardware Type");
  public mediaFormat = this.field.bind(this, "Media Format");
  public contentType = this.field.bind(this, "Content Type");
  public productionStart = this.field.bind(this, "Production Start");
  public productionEnd = this.field.bind(this, "Production End");

  public games(): Promise<ZGridViewComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZGridViewComponentModel);
  }

  public game(id: string): Promise<ZBoxComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZBoxComponentModel, id);
  }
}
