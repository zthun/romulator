import { resolve } from "node:path";
import { ZDir } from "../dir/dir.js";

import type { IZRomulatorConfig } from "@zthun/romulator-client";
import { ZRomulatorConfigBuilder } from "@zthun/romulator-client";

export class ZRomulatorConfigDto {
  public static all(): ZRomulatorConfigDto[] {
    return [ZRomulatorConfigDto.games(), ZRomulatorConfigDto.emulators()];
  }

  public static games = () => new ZRomulatorConfigDto("games");
  public static emulators = () => new ZRomulatorConfigDto("emulators");

  public readonly file: string;

  private constructor(public readonly id: string) {
    this.file = resolve(ZDir.configs(), `${id}.json`);
  }

  public toClient<T>(contents?: T): IZRomulatorConfig<T> {
    return new ZRomulatorConfigBuilder<T>()
      .id(this.id)
      .file(this.file)
      .contents(contents)
      .build();
  }
}
