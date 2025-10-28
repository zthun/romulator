import { castExtension } from "@zthun/helpful-fn";
import { castArray, get, lowerCase, uniqBy } from "lodash-es";
import {
  isSystemContentType,
  ZRomulatorSystemContentType,
} from "./system-content-type.mjs";
import {
  isSystemHardwareType,
  ZRomulatorSystemHardwareType,
} from "./system-hardware-type.mjs";
import { isSystemId, ZRomulatorSystemId } from "./system-id.mjs";
import {
  isSystemMediaFormat,
  ZRomulatorSystemMediaFormat,
} from "./system-media-format-type.mjs";

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
   * Type classifications for the system.
   */
  classification: {
    /**
     * What type of system the hardware is.
     *
     * @example 'console'
     */
    hardwareType: ZRomulatorSystemHardwareType;

    /**
     * The type of media format.
     */
    mediaFormat: ZRomulatorSystemMediaFormat;

    /**
     * The digital format of the game media.
     */
    contentType: ZRomulatorSystemContentType;
  };

  /**
   * The canonical name of the system.
   *
   * This is the most globally recognized name,
   * not the historical accurate name for each
   * and every region.
   */
  name: string;

  /**
   * The company that published the system.
   */
  company: string;

  /**
   * The years the system was in production until.
   */
  productionYears: {
    /**
     * The first year the system went into production.
     *
     * Uses ? if we are not sure.
     */
    start: number | "?";
    /**
     * The year when production stopped.
     *
     * Current implies that production is still happening.
     */
    end: number | "current";
  };
}

/**
 * A builder for creating an IZRomulatorSystem.
 */
export class ZRomulatorSystemBuilder {
  private _system: IZRomulatorSystem = {
    id: ZRomulatorSystemId.Nintendo,
    name: "",

    classification: {
      hardwareType: ZRomulatorSystemHardwareType.Unknown,
      mediaFormat: ZRomulatorSystemMediaFormat.Unknown,
      contentType: ZRomulatorSystemContentType.Unknown,
    },

    company: "",

    productionYears: {
      start: "?",
      end: "current",
    },

    extensions: [".zip", ".7z"],
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
    this._system.classification.contentType = type;
    return this;
  }

  /**
   * Sets the production start value.
   *
   * @param start -
   *        The year the system was released into production.
   *        Use '?' if you do not know this information.
   *
   * @returns
   *        This object.
   */
  public productionStart(start: number | "?") {
    this._system.productionYears.start = start;

    return this;
  }

  /**
   * Sets the production end of life value.
   *
   * @param end -
   *        The end of life year.  Set to current
   *        to mark no end of life.
   *
   * @returns
   *        This object.
   */
  public productionEnd(end: number | "current") {
    this._system.productionYears.end = end;

    return this;
  }

  /**
   * Sets the full production run.
   *
   * @param start -
   *        The starting year of production.
   * @param end -
   *        The last year of production.
   *
   * @returns
   *        This object.
   */
  public production(
    start: number | "?" = "?",
    end: number | "current" = "current",
  ) {
    return this.productionStart(start).productionEnd(end);
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
    const current = this._system.extensions.slice();
    const extensions = castArray(extension).map((e) => castExtension(e));
    const unique = uniqBy(current.concat(extensions), lowerCase);

    this._system.extensions = unique
      .filter((e) => e != null)
      .map((e) => e?.toLowerCase());

    return this;
  }

  private parseId(candidate: object) {
    const id = get(candidate, "id");

    return isSystemId(id) ? this.id(id) : this;
  }

  private parseName(candidate: object) {
    const name = get(candidate, "name");

    return name != null && typeof name === "string" ? this.name(name) : this;
  }

  private parseCompany(candidate: object) {
    const company = get(candidate, "company");

    return company != null && typeof company === "string"
      ? this.company(company)
      : this;
  }

  private parseExtensions(candidate: object) {
    const extensions = castArray(get(candidate, "extensions"))
      .filter((ext) => ext != null)
      .filter((ext) => typeof ext === "string")
      .map((ext) => castExtension(ext));

    return this.extension(extensions);
  }

  private parseHardwareType(classification: object) {
    const hardwareType = get(classification, "hardwareType");

    return isSystemHardwareType(hardwareType)
      ? this.hardware(hardwareType)
      : this;
  }

  private parseMediaFormat(classification: object) {
    const mediaFormat = get(classification, "mediaFormat");

    return isSystemMediaFormat(mediaFormat)
      ? this.mediaFormat(mediaFormat)
      : this;
  }

  private parseContentType(classification: object) {
    const contentType = get(classification, "contentType");

    return isSystemContentType(contentType)
      ? this.contentType(contentType)
      : this;
  }

  private parseClassification(candidate: object) {
    const classification = get(candidate, "classification");

    return classification != null && typeof classification === "object"
      ? this.parseHardwareType(classification)
          .parseMediaFormat(classification)
          .parseContentType(classification)
      : this;
  }

  private parseProductionStart(productionYears: object) {
    const start = get(productionYears, "start");

    return typeof start === "number" || start === "?"
      ? this.productionStart(start)
      : this;
  }

  private parseProductionEnd(productionYears: object) {
    const end = get(productionYears, "end");

    return typeof end === "number" || end === "current"
      ? this.productionEnd(end)
      : this;
  }

  private parseProductionYears(candidate: object) {
    const production = get(candidate, "productionYears");

    return production != null && typeof production === "object"
      ? this.parseProductionStart(production).parseProductionEnd(production)
      : this;
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

    this.parseId(candidate)
      .parseName(candidate)
      .parseCompany(candidate)
      .parseExtensions(candidate)
      .parseClassification(candidate)
      .parseProductionYears(candidate);

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
