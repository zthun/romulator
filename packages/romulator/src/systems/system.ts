import { ZRomulatorRegionMap } from "../region/region";
import { ZRomulatorSystemType } from "./system-type";

export interface IZRomulatorSystem {
  id?: string;
  generation?: number;
  developer?: string;
  manufacturer?: string;
  type?: ZRomulatorSystemType;

  name?: ZRomulatorRegionMap<string>;
  short?: ZRomulatorRegionMap<string>;
  release?: ZRomulatorRegionMap<string>;
  discontinued?: ZRomulatorRegionMap<string>;
}

export class ZRomulatorSystemBuilder {
  private _system: IZRomulatorSystem = {};

  public id(id: string): this {
    this._system.id = id;
    return this;
  }

  public generation(generation: number): this {
    this._system.generation = generation;
    return this;
  }

  public developer(developer: string): this {
    this._system.developer = developer;
    return this;
  }

  public manufacturer(manufacturer: string): this {
    this._system.manufacturer = manufacturer;
    return this;
  }

  public build() {
    return structuredClone(this._system);
  }
}
