/**
 * The type of media a system supports.
 */
export enum ZRomulatorSystemMediaFormatType {
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
