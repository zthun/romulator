import { keyBy } from "lodash-es";

/**
 * Id slugs for supported systems.
 */
export enum ZRomulatorSystemId {
  /**
   * Nintendo Entertainment System
   */
  Nintendo = "nes",
  /**
   * Super Nintendo Entertainment System.
   */
  SuperNintendo = "snes",
  /**
   * Nintendo 64
   */
  Nintendo64 = "n64",
  /**
   * Nintendo GameCube
   */
  GameCube = "gc",
  /**
   * Nintendo Wii
   */
  Wii = "wii",
  /**
   * Nintendo Wii U
   */
  WiiU = "wiiu",
  /**
   * Nintendo Switch
   */
  Switch = "switch",
}

const ZRomulatorSystemIdMap = keyBy(Object.values(ZRomulatorSystemId));

/**
 * Gets whether a candidate string represents a system id.
 */
export function isSystemId(candidate: any): candidate is ZRomulatorSystemId {
  return (
    typeof candidate === "string" &&
    Object.prototype.hasOwnProperty.call(ZRomulatorSystemIdMap, candidate)
  );
}
