import { ZCircusBy, ZCircusComponentModel } from "@zthun/cirque";
import {
  ZAlertComponentModel,
  ZSuspenseComponentModel,
} from "@zthun/fashion-boutique";
import { ZRomulatorGameMediaType } from "@zthun/romulator-client";
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
}
