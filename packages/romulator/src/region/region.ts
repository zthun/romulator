/**
 * Enum representing different regions for the Romulator.
 */
export enum ZRomulatorRegion {
  /**
   * Australia
   */
  Australia = "aus",

  /**
   * Brazil
   */
  Brazil = "br",

  /**
   * Chile
   */
  Chile = "chl",

  /**
   * Europe
   */
  Europe = "eu",

  /**
   * Ireland
   */
  Ireland = "irl",

  /**
   * Japan
   */
  Japan = "jp",

  /**
   * North America
   */
  NorthAmerica = "na",

  /**
   * Russia
   */
  Russia = "ru",

  /**
   * United Kingdom
   */
  UnitedKingdom = "uk",

  /**
   * World.
   *
   * This region is used for games that are released
   * globally without specific regional variations.
   */
  World = "world",
}

/**
 * Represents a mapping of regions to data.
 */
export type ZRomulatorRegionMap<T> = Partial<Record<ZRomulatorRegion, T>>;

/**
 * A builder for creating a region map for values.
 */
export class ZRomulatorRegionMapBuilder<T> {
  private _map: ZRomulatorRegionMap<T> = {};

  /**
   * Sets the value for a specific region.
   * @param region
   *        The region to set the value for.
   * @param value
   *        The value to set.
   * @returns
   *        This instance.
   */
  public set(region: ZRomulatorRegion, value: T): this {
    this._map[region] = value;
    return this;
  }

  public aus = this.set.bind(this, ZRomulatorRegion.Australia);
  public br = this.set.bind(this, ZRomulatorRegion.Brazil);
  public chl = this.set.bind(this, ZRomulatorRegion.Chile);
  public eu = this.set.bind(this, ZRomulatorRegion.Europe);
  public irl = this.set.bind(this, ZRomulatorRegion.Ireland);
  public jp = this.set.bind(this, ZRomulatorRegion.Japan);
  public na = this.set.bind(this, ZRomulatorRegion.NorthAmerica);
  public ru = this.set.bind(this, ZRomulatorRegion.Russia);
  public uk = this.set.bind(this, ZRomulatorRegion.UnitedKingdom);
  public world = this.set.bind(this, ZRomulatorRegion.World);

  public build(): ZRomulatorRegionMap<T> {
    return structuredClone(this._map);
  }
}
