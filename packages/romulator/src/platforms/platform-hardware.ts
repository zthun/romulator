/**
 * A description of the hardware capabilities of a system.
 */
export interface IZRomulatorPlatformHardware {
  /**
   * The operating system of the system.
   */
  os?: string;
  /**
   * The CPU used in the system.
   */
  cpu?: string;
  /**
   * The total amount of memory in the system.
   */
  memory?: string;
  /**
   * The storage capabilities of the system.
   */
  storage?: { internal?: string; removable?: string };
}
