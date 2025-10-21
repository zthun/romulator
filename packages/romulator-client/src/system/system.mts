import { pick } from "lodash-es";
import { ZRomulatorSystemId } from "./system-id.mjs";
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
  id: ZRomulatorSystemId;

  /**
   * The list of file extensions that system supports.
   */
  extensions?: string[];

  /**
   * The canonical name of the system.
   *
   * This is the most globally recognized name,
   * not the historical accurate name for each
   * and every region.
   */
  name?: string;

  /**
   * The generational index of the system.
   */
  generation?: number;

  /**
   * The type of system.
   */
  type?: ZRomulatorSystemType;
}

/**
 * A builder for creating an IZRomulatorSystem.
 */
export class ZRomulatorSystemBuilder {
  private _system: IZRomulatorSystem = {
    id: ZRomulatorSystemId.Nintendo,
  };

  /**
   * Sets the id (slug) of the system.
   *
   * @param id -
   *        The unique identifier for the system.
   * @returns
   *        This instance.
   */
  public id(id: ZRomulatorSystemId): this {
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
   * Assigns system data to this system.
   *
   * @param system -
   *        The partial system data to assign.
   *
   * @returns
   *        This object.
   */
  public assign(system: Partial<IZRomulatorSystem>) {
    this._system = { ...this._system, ...system };
    return this;
  }

  /**
   * Removes anything that is not a valid property on this object.
   */
  public redact() {
    this._system = pick(this._system, "id", "name", "generation", "type");
    return this;
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
