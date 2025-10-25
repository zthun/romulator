import { keyBy } from "lodash-es";

/**
 * The type of media a system supports.
 */
export enum ZRomulatorSystemMediaFormat {
  /**
   * No idea
   */
  Unknown = "unknown",
  /**
   * Cartridge based systems.
   */
  Cartridge = "cartridge",

  /**
   * Motherboard based systems.
   *
   * Usually for arcades.
   */
  Pcb = "pcb",

  /**
   * CD/DVD based systems.
   */
  Cd = "cd",

  /**
   * Floppy disk based systems.
   */
  FloppyDisk = "floppy-disk",
}

const ZRomulatorSystemMediaFormatMap = keyBy(
  Object.values(ZRomulatorSystemMediaFormat),
);

/**
 * Gets whether a candidate string represents a system media format.
 *
 * This check is case sensitive.
 *
 * @param candidate -
 *        The candidate to check.
 *
 * @returns
 *        True if candidate is a string that represents a system media format.
 */
export function isSystemMediaFormat(
  candidate: any,
): candidate is ZRomulatorSystemMediaFormat {
  return (
    typeof candidate === "string" &&
    Object.prototype.hasOwnProperty.call(
      ZRomulatorSystemMediaFormatMap,
      candidate,
    )
  );
}
