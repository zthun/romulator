import { keyBy } from "lodash-es";

export enum ZRomulatorGameMediaType {
  /**
   * A 3d representation of the box art.
   */
  Box3d = "3dboxes",
  /**
   * Back of the game box.
   */
  BackCover = "backcovers",
  /**
   * Front of the game box.
   */
  Cover = "covers",
  /**
   * Fan art.
   */
  FanArt = "fanart",
  /**
   * Game manual.
   */
  Manual = "manuals",
  /**
   * A marquee of a game.
   */
  Marquee = "marquees",
  /**
   * The cartridge or disc label.
   */
  PhysicalMedia = "physicalmedia",
  /**
   * An in game screenshot showcasing gameplay.
   */
  Screenshot = "screenshots",
  /**
   * An in game screenshot of the title screen.
   */
  Title = "titlescreens",
  /**
   * A video showcasing the game.
   */
  Video = "videos",
}

/**
 * Media type for a system.
 */
export enum ZRomulatorSystemMediaType {
  /**
   * An image of a system's controller.
   */
  Controller = "controller",
  /**
   * A icon for the system.
   *
   * These are normally 32x32.
   */
  Icon = "icon",
  /**
   * An illustration of the system.
   */
  Illustration = "illustration",
  /**
   * A picture of the system.
   *
   * These are real life looking photos of what
   * a system looks like.
   */
  Picture = "picture",
  /**
   * A wheel for a system.
   *
   * This is basically the logo.
   */
  Wheel = "wheel",
}

/**
 * Describes what a specific piece of media represents.
 */
export type ZRomulatorMediaType =
  | ZRomulatorSystemMediaType
  | ZRomulatorGameMediaType;

const ZRomulatorSystemMediaTypeMap = keyBy(
  Object.values(ZRomulatorSystemMediaType),
);
const ZRomulatorGameMediaTypeMap = keyBy(
  Object.values(ZRomulatorGameMediaType),
);

export function isSystemMediaType(
  candidate: any,
): candidate is ZRomulatorSystemMediaType {
  return (
    typeof candidate === "string" &&
    Object.prototype.hasOwnProperty.call(
      ZRomulatorSystemMediaTypeMap,
      candidate,
    )
  );
}

export function isGameMediaType(
  candidate: any,
): candidate is ZRomulatorGameMediaType {
  return (
    typeof candidate === "string" &&
    Object.prototype.hasOwnProperty.call(ZRomulatorGameMediaTypeMap, candidate)
  );
}

export function isMediaType(candidate: any): candidate is ZRomulatorMediaType {
  return isSystemMediaType(candidate) || isGameMediaType(candidate);
}
