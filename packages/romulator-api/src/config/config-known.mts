import {
  ZRomulatorConfigBuilder,
  ZRomulatorConfigGamesMetadata,
  ZRomulatorConfigId,
  ZRomulatorConfigMediaMetadata,
} from "@zthun/romulator-client";
import { resolve } from "node:path";
import { ZDir } from "../dir/dir.js";

export abstract class ZRomulatorConfigKnown {
  public static all() {
    return [
      ZRomulatorConfigKnown.games().build(),
      ZRomulatorConfigKnown.media().build(),
    ];
  }

  private static create(id: ZRomulatorConfigId) {
    const file = resolve(ZDir.configs(), `${id}.json`);
    return new ZRomulatorConfigBuilder().id(id).file(file);
  }

  public static games() {
    return ZRomulatorConfigKnown.create(ZRomulatorConfigId.Games)
      .name("Game Settings")
      .description("Modify where your games are stored and related settings")
      .avatar("gamepad")
      .metadata(ZRomulatorConfigGamesMetadata.all());
  }

  public static media() {
    return ZRomulatorConfigKnown.create(ZRomulatorConfigId.Media)
      .name("Media Settings")
      .description("Modify where media is stored and what media to retrieve")
      .avatar("image")
      .metadata(ZRomulatorConfigMediaMetadata.all());
  }
}
