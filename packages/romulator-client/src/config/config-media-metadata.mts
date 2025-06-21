import { ZMetadataBuilder, type IZMetadata } from "@zthun/helpful-query";

export abstract class ZRomulatorConfigMediaMetadata {
  public static all(): IZMetadata[] {
    return [ZRomulatorConfigMediaMetadata.mediaFolder()];
  }

  public static mediaFolder(): IZMetadata {
    return new ZMetadataBuilder()
      .id("media-folder")
      .path("mediaFolder")
      .name("Media Folder")
      .editable()
      .file()
      .build();
  }
}
