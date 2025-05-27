/**
 * A description of the hardware capabilities of a system.
 */
export interface IZRomulatorHardware {
  os?: string;
  cpu?: string;
  memory?: string;
  storage?: { internal?: string; removable?: string };
}
