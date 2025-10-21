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
