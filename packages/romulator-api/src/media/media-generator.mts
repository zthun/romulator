import { Injectable } from "@nestjs/common";
import { html } from "@zthun/helpful-fn";

/**
 * The injection token for the media generator.
 */
export const ZRomulatorMediaGeneratorToken = Symbol("media-generator");

/**
 * A generator that generates in memory media for systems and
 * games that have their media missing.
 */
export interface IZRomulatorMediaGenerator {
  /**
   * Generates a wheel image with a given name.
   *
   * A wheel is 373x187 pixels. It'll have a transparent background
   * with the name in uppercase It will display the name
   * in the middle of the wheel image.  It assumes it will live on a
   * dark background so the name will be white.
   *
   * @param name -
   *        The name to place in the middle of the wheel image.
   *
   * @returns
   *        A buffer with the generated wheel.
   */
  generate(name: string): Promise<Buffer>;
}

/**
 * An implementation of the ZRomulatorMediaGenerator.
 */
@Injectable()
export class ZRomulatorMediaGenerator implements IZRomulatorMediaGenerator {
  public generate(name: string): Promise<Buffer> {
    const width = 373;
    const height = 187;
    const fallbackName = name?.trim().length ? name.trim() : "?";
    const uppercaseName = fallbackName.toUpperCase();
    const escapedName = this.escapeSvgText(uppercaseName);

    const svg = html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="${width}"
        height="${height}"
        viewBox="0 0 ${width} ${height}"
      >
        <text
          x="50%"
          y="50%"
          fill="#fff"
          font-size="48"
          text-anchor="middle"
          textLength="${width}"
          lengthAdjust="spacingAndGlyphs"
        >
          ${escapedName}
        </text>
      </svg>
    `;

    return Promise.resolve(Buffer.from(svg));
  }

  private escapeSvgText(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}
