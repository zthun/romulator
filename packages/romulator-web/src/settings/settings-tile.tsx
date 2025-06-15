import { ZIconFontAwesome } from "@zthun/fashion-boutique";
import { ZSizeFixed } from "@zthun/fashion-tailor";
import type { ReactNode } from "react";

export interface IZRomulatorSettingsTile {
  name: string;
  description: string;
  avatar: ReactNode;
}

export class ZRomulatorSettingsTileBuilder {
  public static all() {
    return [
      new ZRomulatorSettingsTileBuilder().games().build(),
      new ZRomulatorSettingsTileBuilder().emulators().build(),
    ];
  }

  private _tile: IZRomulatorSettingsTile = {
    name: "",
    description: "",
    avatar: null,
  };

  public name(name: string): this {
    this._tile.name = name;
    return this;
  }

  public description(description: string): this {
    this._tile.description = description;
    return this;
  }

  public avatar(node: ReactNode) {
    this._tile.avatar = node;
    return this;
  }

  public fontAwesome(name: string) {
    return this.avatar(
      <ZIconFontAwesome name={name} width={ZSizeFixed.Medium} />,
    );
  }

  public games() {
    return this.name("games")
      .description("Modify your games and media settings")
      .fontAwesome("gamepad");
  }

  public emulators() {
    return this.name("emulators")
      .description("Modify emulator paths and launch options")
      .fontAwesome("microchip");
  }

  public build() {
    return { ...this._tile };
  }
}
