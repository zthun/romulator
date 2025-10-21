import { firstDefined } from "@zthun/helpful-fn";
import { isUndefined, omitBy, pick } from "lodash-es";
import type { ZRomulatorSystemContentType } from "./system-content-type.mjs";
import type { ZRomulatorSystemHardwareType } from "./system-hardware-type.mjs";
import { ZRomulatorSystemId } from "./system-id.mjs";
import type { ZRomulatorSystemMediaFormatType } from "./system-media-format-type.mjs";

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
   * for ES-DE or retro-pie, for example, the id
   * would map to the name of the system directory.
   *
   * This is essentially a slug.
   */
  id: ZRomulatorSystemId;

  /**
   * The canonical name of the system.
   *
   * This is the most globally recognized name,
   * not the historical accurate name for each
   * and every region.
   */
  name?: string;

  /**
   * The company that published the system.
   */
  company?: string;

  /**
   * The list of file extensions that system supports.
   */
  extensions?: string[];

  /**
   * Type classifications for the system.
   */
  classification?: {
    /**
     * What type of system the hardware is.
     *
     * @example 'console'
     */
    hardwareType?: ZRomulatorSystemHardwareType;

    /**
     * The type of media format.
     */
    mediaFormat?: ZRomulatorSystemMediaFormatType;

    /**
     * The digital format of the game media.
     */
    contentType?: ZRomulatorSystemContentType;
  };

  /**
   * The years the system was in production until.
   */
  productionYears?: {
    /**
     * The first year the system went into production.
     */
    start: number;
    /**
     * The year when production stopped.
     */
    end?: number;
  };
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
   * Sets the system hardware type.
   *
   * @param type -
   *        The system hardware type.
   *
   * @returns
   *        This instance.
   */
  public hardware(type: ZRomulatorSystemHardwareType): this {
    this._system.classification = firstDefined({}, this._system.classification);
    this._system.classification.hardwareType = type;
    return this;
  }

  /**
   * Sets the system media format.
   *
   * @param type -
   *        The system media format.
   *
   * @returns
   *        This instance.
   */
  public mediaFormat(type: ZRomulatorSystemMediaFormatType): this {
    this._system.classification = firstDefined({}, this._system.classification);
    this._system.classification.mediaFormat = type;
    return this;
  }

  /**
   * Sets the system content type.
   *
   * @param type -
   *        The system content type.
   *
   * @returns
   *        This instance.
   */
  public contentType(type: ZRomulatorSystemContentType): this {
    this._system.classification = firstDefined({}, this._system.classification);
    this._system.classification.contentType = type;
    return this;
  }

  /**
   * Sets the production run.
   *
   * @param start -
   *        The starting year of production.
   * @param end -
   *        The last year of production.
   *
   * @returns
   *        This object.
   */
  public production(start: number, end?: number) {
    delete this._system.productionYears;
    this._system.productionYears = {
      start,
      end,
    };
    this._system.productionYears = omitBy(
      this._system.productionYears,
      isUndefined,
    ) as { start: number; end?: number };
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
    this._system = pick(
      this._system,
      "id",
      "name",
      "company",
      "extensions",
      "classification",
      "productionYears",
    );
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
