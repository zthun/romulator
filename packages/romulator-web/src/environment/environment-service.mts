/* istanbul ignore file -- @preserve */
import {
  IZRomulatorEnvironment,
  ZRomulatorEnvironmentBuilder,
} from "./environment.mjs";

export interface IZRomulatorEnvironmentService {
  read(): Promise<IZRomulatorEnvironment>;
}

export class ZRomulatorEnvironmentService
  implements IZRomulatorEnvironmentService
{
  public read(): Promise<IZRomulatorEnvironment> {
    return Promise.resolve(new ZRomulatorEnvironmentBuilder().build());
  }
}

export function createDefaultEnvironmentService(): IZRomulatorEnvironmentService {
  return new ZRomulatorEnvironmentService();
}
