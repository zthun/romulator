import { keyBy } from "lodash-es";

/**
 * The type of media content for a system.
 */
export enum ZRomulatorSystemContentType {
  /**
   * Uses memory roms.
   */
  ReadOnlyMemory = "rom",
  /**
   * Folder based game with a known structure.
   */
  Folder = "folder",
  /**
   * Executable file.
   */
  File = "file",
  /**
   * Spinning disk media.
   */
  Disk = "iso",
}

const ZRomulatorSystemContentTypeMap = keyBy(
  Object.values(ZRomulatorSystemContentType),
);

/**
 * Gets whether a candidate string represents a system content type.
 *
 * This check is case sensitive.
 *
 * @param candidate -
 *        The candidate to check.
 *
 * @returns
 *        True if candidate is a string that represents a system content type.
 */
export function isSystemContentType(
  candidate: any,
): candidate is ZRomulatorSystemContentType {
  return (
    typeof candidate === "string" &&
    Object.prototype.hasOwnProperty.call(
      ZRomulatorSystemContentTypeMap,
      candidate,
    )
  );
}
