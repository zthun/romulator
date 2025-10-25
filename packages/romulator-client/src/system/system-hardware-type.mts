import { keyBy } from "lodash-es";

/**
 * Describes the type of hardware a system is.
 */
export enum ZRomulatorSystemHardwareType {
  /**
   * No idea what this is.
   */
  Unknown = "unknown",
  /**
   * An accessory that attaches to another system.
   */
  Accessory = "accessory",

  /**
   * A cabinet system
   */
  Arcade = "arcade",

  /**
   * Known computer systems
   */
  Computer = "computer",

  /**
   * A console system.
   */
  Console = "console",

  /**
   * Pinball
   */
  Flipper = "flipper",

  /**
   * A handheld system
   */
  Handheld = "console-portable",

  /**
   * Script Creation Utility.
   */
  ScummVm = "scummvm",

  /**
   * Phone based system
   */
  Smartphone = "smartphone",

  /**
   * Virtual machine based system.
   */
  VirtualMachine = "virtual-machine",
}

const ZRomulatorSystemHardwareTypeMap = keyBy(
  Object.values(ZRomulatorSystemHardwareType),
);

/**
 * Gets whether a candidate string represents a system hardware type.
 *
 * This check is case sensitive.
 *
 * @param candidate -
 *        The candidate to check.
 *
 * @returns
 *        True if candidate is a string that represents a system hardware type.
 */
export function isSystemHardwareType(
  candidate: any,
): candidate is ZRomulatorSystemHardwareType {
  return (
    typeof candidate === "string" &&
    Object.prototype.hasOwnProperty.call(
      ZRomulatorSystemHardwareTypeMap,
      candidate,
    )
  );
}
