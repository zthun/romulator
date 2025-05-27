import { ZRomulatorRegion } from "../region/region";

export interface IZRomulatorSystem {
  id?: string;
  name?: string;
  short?: string;

  developer?: string;
  generation?: number;
  manufacturer?: string;

  releaseDate?: string;
  discontinued?: string;
  sold?: number;
  price?: number;
  region?: ZRomulatorRegion;
}

export class ZRomulatorSystemBuilder {
  private _system: IZRomulatorSystem = {};

  public id(id: string): this {
    this._system.id = id;
    return this;
  }

  public name(name: string): this {
    this._system.name = name;
    return this;
  }

  public short(short: string): this {
    this._system.short = short;
    return this;
  }

  public region(region: ZRomulatorRegion): this {
    this._system.region = region;
    return this;
  }

  public nes() {
    return this.id("nes").name("Nintendo Entertainment System").short("NES");
  }

  public snes() {
    return this.id("snes")
      .name("Super Nintendo Entertainment System")
      .short("SNES");
  }

  public megadrive() {
    return this.id("megadrive").name("Sega Mega Drive").short("Mega Drive");
  }

  public genesis = this.megadrive.bind(this);

  public build() {
    return structuredClone(this._system);
  }
}
