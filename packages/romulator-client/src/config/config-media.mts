export interface IZRomulatorConfigMedia {
  mediaFolder?: string;
}

export class ZRomulatorConfigMediaBuilder {
  private _media: IZRomulatorConfigMedia = {};

  public mediaFolder(folder: string) {
    this._media.mediaFolder = folder;
    return this;
  }

  public build() {
    return structuredClone(this._media);
  }
}
