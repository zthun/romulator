import { firstDefined } from "@zthun/helpful-fn";
import {
  castArray,
  get,
  isUndefined,
  omitBy,
  uniqBy,
  upperCase,
} from "lodash-es";
import type { ZRomulatorSystemContentType } from "./system-content-type.mjs";
import type { ZRomulatorSystemHardwareType } from "./system-hardware-type.mjs";
import { isSystemId, ZRomulatorSystemId } from "./system-id.mjs";
import type { ZRomulatorSystemMediaFormat } from "./system-media-format-type.mjs";

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
   * The list of file extensions that system supports.
   *
   * Extensions, zip and 7z, should always be in this list.
   */
  extensions: string[];

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
    mediaFormat?: ZRomulatorSystemMediaFormat;

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
    start?: number;
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
    extensions: ["zip", "7z"],
  };

  /**
   * Sets the id (slug) of the system.
   *
   * @param id -
   *        The unique identifier for the system.
   *
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
   *
   * @returns
   *        This instance.
   */
  public name(name: string): this {
    this._system.name = name;

    return this;
  }

  /**
   * Sets the company that published the system.
   *
   * @param name -
   *        The name of the company.
   *
   * @returns
   *        This instance.
   */
  public company(name: string): this {
    this._system.company = name;

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
  public mediaFormat(type: ZRomulatorSystemMediaFormat): this {
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
    );

    return this;
  }

  /**
   * Adds to the extension list.
   *
   * @param extension -
   *        The extension or list of extensions to add.
   *
   * @returns
   *        This object.
   */
  public extension(extension: string | string[]) {
    const extensions = firstDefined([], this._system.extensions);
    this._system.extensions = uniqBy<string>(
      extensions.concat(extension),
      upperCase,
    ).map((e) => e.toLowerCase());

    return this;
  }

  /**
   * Parses an unknown object to try and build a system from it.
   *
   * @param candidate -
   *        The candidate to try and parse.
   *
   * @returns
   *        This object.
   */
  public parse(candidate: unknown) {
    if (candidate == null || typeof candidate !== "object") {
      return this;
    }

    const id = get(candidate, "id");
    const name = get(candidate, "name");
    const company = get(candidate, "company");
    const extensions = castArray(get(candidate, "extensions"))
      .filter((ext) => ext != null)
      .filter((ext) => typeof ext === "string");

    if (isSystemId(id)) {
      this.id(id);
    }

    if (name != null && typeof name === "string") {
      this.name(name);
    }

    if (company != null && typeof company === "string") {
      this.company(company);
    }

    return this.extension(extensions);
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
