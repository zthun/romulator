import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZAlertComponentModel,
  ZButtonComponentModel,
  ZCardComponentModel,
  ZSuspenseComponentModel,
} from "@zthun/fashion-boutique";
import { firstDefined } from "@zthun/helpful-fn";
import { ZRomulatorGameMediaType } from "@zthun/romulator-client";
import { kebabCase } from "lodash-es";
import { ZRomulatorMediaCardComponentModel } from "../media/media-card.cm.mjs";

const {
  BackCover,
  Box3d,
  Cover,
  FanArt,
  Marquee,
  PhysicalMedia,
  Screenshot,
  Title,
} = ZRomulatorGameMediaType;

export class ZRomulatorGamePageComponentModel extends ZCircusComponentModel {
  public static readonly Selector = ".ZRomulatorGamePage-root";

  public async loader(): Promise<ZSuspenseComponentModel | null> {
    return ZCircusBy.optional(
      this.driver,
      ZSuspenseComponentModel,
      "game-loading",
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

  public synopsis(): Promise<ZCardComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZCardComponentModel, "synopsis");
  }

  public system(): Promise<ZCardComponentModel | null> {
    return ZCircusBy.optional(this.driver, ZCardComponentModel, "system");
  }

  private media(
    type: ZRomulatorGameMediaType,
  ): Promise<ZRomulatorMediaCardComponentModel | null> {
    return ZCircusBy.optional(
      this.driver,
      ZRomulatorMediaCardComponentModel,
      type,
    );
  }

  public backCover = this.media.bind(this, BackCover);
  public box3d = this.media.bind(this, Box3d);
  public cover = this.media.bind(this, Cover);
  public fanArt = this.media.bind(this, FanArt);
  public marquee = this.media.bind(this, Marquee);
  public physicalMedia = this.media.bind(this, PhysicalMedia);
  public screenshot = this.media.bind(this, Screenshot);
  public title = this.media.bind(this, Title);

  private async field(key: string): Promise<string> {
    const info = await this.info();
    const klass = `.ZRomulatorGamePage-${kebabCase(key)}`;
    const element = await info?.driver.select(klass);
    const value = await element?.attribute("data-value", "");
    return firstDefined("", value);
  }

  public name = this.field.bind(this, "Name");
  public file = this.field.bind(this, "File");
  public players = this.field.bind(this, "Players");
  public release = this.field.bind(this, "Release Date");
  public developer = this.field.bind(this, "Developer");
  public publisher = this.field.bind(this, "Publisher");

  public async description(): Promise<string> {
    const synopsis = await this.synopsis();
    const content = await synopsis?.content();

    return firstDefined("", await content?.text());
  }

  public async navigateToSystem(): Promise<ZButtonComponentModel | null> {
    const system = await this.system();
    const container = await system?.footer();

    if (container == null) {
      return null;
    }

    return await ZCircusBy.first(
      container,
      ZButtonComponentModel,
      "navigate-to-system",
    );
  }
}
