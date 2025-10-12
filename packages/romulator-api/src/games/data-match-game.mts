import { firstTruthy } from "@zthun/helpful-fn";
import type { IZDataMatch } from "@zthun/helpful-query";
import type { IZRomulatorGame } from "@zthun/romulator-client";
import { ZRomulatorSystemKnown } from "../systems/system-known.mjs";

/**
 * A data match function which matches a string (search) filter
 * to a game's name, system slug, or system name.
 */
export class ZRomulatorDataMatchGame
  implements IZDataMatch<IZRomulatorGame, string>
{
  public match(data: IZRomulatorGame, filter: string): boolean {
    const needle = filter?.trim().toLowerCase();
    const { name = "", system = "" } = data;
    const target = ZRomulatorSystemKnown.from(system);
    const systemName = firstTruthy("", target?.name);

    if (!needle?.length) {
      return true;
    }

    return [name, system, systemName]
      .filter((s) => s.length)
      .some((k) => k.toLowerCase().includes(needle));
  }
}
