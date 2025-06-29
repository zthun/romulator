import { keyBy } from "lodash-es";

/**
 * Describes what a specific piece of media represents.
 */
export enum ZRomulatorMediaType {
  /**
   * A 3d representation of the box art.
   */
  Game3dBox = "3dboxes",
  /**
   * Back of the game box.
   */
  GameBackCover = "backcovers",
  /**
   * Front of the game box.
   */
  GameCover = "covers",
  /**
   * Fan art.
   */
  GameFanArt = "fanart",
  /**
   * Game manual.
   */
  GameManual = "manuals",
  /**
   * A marquee of a game.
   */
  GameMarquee = "marquees",
  /**
   * The cartridge or disc label.
   */
  GamePhysicalMedia = "physicalmedia",
  /**
   * An in game screenshot showcasing gameplay.
   */
  GameScreenshot = "screenshots",
  /**
   * An in game screenshot of the title screen.
   */
  GameTitle = "titlescreens",
  /**
   * A video showcasing the game.
   */
  GameVideo = "videos",
  /**
   * An image of a system's controller.
   */
  SystemController = "controller.png",
  /**
   * A icon for the system.
   *
   * These are normally 32x32.
   */
  SystemIcon = "icon.png",
  /**
   * An illustration of the system.
   */
  SystemIllustration = "illustration.png",
  /**
   * A picture of the system.
   *
   * These are real life looking photos of what
   * a system looks like.
   */
  SystemPicture = "picture.png",
  /**
   * A wheel for a system.
   *
   * This is basically the logo.
   */
  SystemWheel = "wheel.png",
}

const ZRomulatorMediaTypeMap = keyBy(Object.values(ZRomulatorMediaType));

export function isMediaType(candidate: any): candidate is ZRomulatorMediaType {
  return (
    typeof candidate === "string" &&
    Object.prototype.hasOwnProperty.call(ZRomulatorMediaTypeMap, candidate)
  );
}
