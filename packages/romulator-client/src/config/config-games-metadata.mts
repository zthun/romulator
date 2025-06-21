import { ZMetadataBuilder, type IZMetadata } from "@zthun/helpful-query";

export abstract class ZRomulatorConfigGamesMetadata {
  public static all(): IZMetadata[] {
    return [ZRomulatorConfigGamesMetadata.gamesFolder()];
  }

  public static gamesFolder(): IZMetadata {
    return new ZMetadataBuilder()
      .id("games-folder")
      .path("gamesFolder")
      .name("Games Folder")
      .fallback("${HOME}/Games")
      .editable()
      .file()
      .build();
  }
}
