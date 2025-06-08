import { uniq } from "lodash-es";
import { ZRomulatorSystemType } from "./system-type.mjs";

/**
 * Represents a system in romulator.
 *
 * These are detected by the file system.
 * See ES-DE for the standard directory
 * structure.
 */
export interface IZRomulatorSystem {
  /**
   * Unique identifier for the system.
   *
   * If you think about the directory structure
   * for ES-DE, for example, the id would map to
   * the name of the system directory.
   *
   * This is essentially a slug.
   */
  id: string;
  /**
   * The canonical name of the system.
   *
   * This is the most globally recognized name,
   * not the historical accurate name for each
   * and every region.
   */
  name: string;
  /**
   * Other names that the system is known by.
   *
   * This helps with searching and scraping
   * media for systems that have multiple names
   * around the world.
   *
   * For example, the Nintendo Entertainment System
   * is known as the Famicom in Japan.
   */
  aliases: string[];
  /**
   * The generational index of the system.
   */
  generation: number;
  /**
   * The system manufacturers.
   *
   * There can be multiple manufacturers for a system.
   */
  manufacturers: string[];
  /**
   * The type of system.
   */
  type: ZRomulatorSystemType;
}

/**
 * A builder for creating an IZRomulatorSystem.
 */
export class ZRomulatorSystemBuilder {
  private _system: IZRomulatorSystem = {
    id: "",
    name: "",
    aliases: [],
    generation: 0,
    manufacturers: [],
    type: ZRomulatorSystemType.Console,
  };

  /**
   * Sets the id (slug) of the system.
   *
   * @param id -
   *        The unique identifier for the system.
   * @returns
   *        This instance.
   */
  public id(id: string): this {
    this._system.id = id;
    return this;
  }

  /**
   * Sets the canonical name of the system.
   *
   * @param name -
   *        The canonical name of the system.
   * @returns
   *        This instance.
   */
  public name(name: string): this {
    this._system.name = name;
    return this;
  }

  /**
   * Sets the system type.
   *
   * @param type -
   *        The type of system.
   * @returns
   *        This instance.
   */
  public type(type: ZRomulatorSystemType): this {
    this._system.type = type;
    return this;
  }

  /**
   * Sets the system type to console.
   *
   * @returns
   *        This instance.
   */
  public console = this.type.bind(this, ZRomulatorSystemType.Console);

  /**
   * Sets the system type to handheld.
   *
   * @returns
   *        This instance.
   */
  public handheld = this.type.bind(this, ZRomulatorSystemType.Handheld);

  /**
   * Sets the system type to arcade.
   *
   * @returns
   *        This instance.
   */
  public arcade = this.type.bind(this, ZRomulatorSystemType.Arcade);

  /**
   * Sets the system type to computer.
   *
   * @returns
   *        This instance.
   */
  public computer = this.type.bind(this, ZRomulatorSystemType.Computer);

  /**
   * Sets the aliases of the system.
   *
   * @param aliases -
   *        The aliases of the system.
   * @returns
   *        This instance.
   */
  public aliases(aliases: string[]): this {
    this._system.aliases = aliases;
    return this;
  }

  /**
   * Adds an alias to the system.
   *
   * If an alias already exists, then it will
   * not be added again.
   *
   * @param alias -
   *        The alias to add to the system.
   * @returns
   *        This instance.
   */
  public alias(alias: string): this {
    const aliases = this._system.aliases.slice();
    aliases.push(alias);
    return this.aliases(uniq(aliases));
  }

  /**
   * Sets the generational index of the system.
   *
   * @param generation -
   *        The generational index of the system.
   * @returns
   *        This instance.
   */
  public generation(generation: number): this {
    this._system.generation = generation;
    return this;
  }

  /**
   * Sets the manufacturers of the system.
   *
   * @param manufacturers -
   *        The manufacturers of the system.
   * @returns
   *        This instance.
   */
  public manufacturers(manufacturers: string[]): this {
    this._system.manufacturers = manufacturers;
    return this;
  }

  /**
   * Adds a manufacturer for the system.
   *
   * If a manufacturer already exists, then it will not be added again.
   *
   * @param manufacturer -
   *        The manufacturer of the system.
   * @returns
   *        This instance.
   */
  public manufacturer(manufacturer: string): this {
    const manufacturers = this._system.manufacturers.slice();
    manufacturers.push(manufacturer);
    return this.manufacturers(uniq(manufacturers));
  }

  /**
   * Builds the system instance.
   *
   * @returns
   *        A structured clone of the current system
   *        that has been built.
   */
  public build() {
    return structuredClone(this._system);
  }
}
