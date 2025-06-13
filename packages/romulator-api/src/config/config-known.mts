import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigId,
} from "@zthun/romulator-client";
import { resolve } from "node:path";
import { ZDir } from "../dir/dir.js";

export abstract class ZRomulatorConfigKnown {
  public static all() {
    return [
      ZRomulatorConfigKnown.games().build(),
      ZRomulatorConfigKnown.emulators().build(),
    ];
  }

  private static create(id: ZRomulatorConfigId) {
    const file = resolve(ZDir.configs(), `${id}.json`);
    return new ZRomulatorConfigBuilder().id(id).file(file);
  }

  public static games() {
    return ZRomulatorConfigKnown.create(ZRomulatorConfigId.Games);
  }

  public static emulators() {
    return ZRomulatorConfigKnown.create(ZRomulatorConfigId.Emulators);
  }
}
