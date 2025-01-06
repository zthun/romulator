import { Injectable } from "@nestjs/common";
import {
  IZRomulatorConfig,
  ZRomulatorConfigBuilder,
} from "@zthun/romulator-models";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { resolve } from "node:path";

export const ZRomulatorConfigsToken = Symbol("configs");

export interface IZRomulatorConfigService {
  read(): Promise<IZRomulatorConfig>;
}

@Injectable()
export class ZRomulatorConfigService implements IZRomulatorConfigService {
  public static applicationDirectory() {
    return resolve(homedir(), ".zthunworks", "romulator");
  }

  public static configFile() {
    return resolve(this.applicationDirectory(), "config.json");
  }

  public async read(): Promise<IZRomulatorConfig> {
    try {
      const contents = await readFile(ZRomulatorConfigService.configFile());
      const candidate = contents.toString("utf8");
      return JSON.parse(candidate);
    } catch {
      return new ZRomulatorConfigBuilder().build();
    }
  }
}
