/**
 * Describes the type of hardware a system is.
 */
export enum ZRomulatorSystemHardwareType {
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
