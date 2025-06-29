import { isTagged, ZTag } from "@zthun/helpful-reflection";
import type { IZRomulatorSystem } from "@zthun/romulator-client";
import {
  ZRomulatorSystemBuilder,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import "reflect-metadata";

const KnownSystem = "@zthunworks/romulator/known-system";

/**
 * A helper factory class for creating supported systems.
 */
export abstract class ZRomulatorSystemKnown {
  /**
   * Returns all known systems.
   *
   * @returns
   *        All supported systems.
   */
  public static all() {
    const properties = Object.getOwnPropertyNames(ZRomulatorSystemKnown);
    const methods = properties
      .filter((p) => isTagged(KnownSystem, ZRomulatorSystemKnown, p))
      .map((p) => ZRomulatorSystemKnown[p])
      .map((f) => f as () => IZRomulatorSystem);
    return methods.map((m) => m.call(null));
  }

  /**
   * Creates a system that represents the Nintendo
   * Entertainment System (NES).
   *
   * @returns
   *        A {@link ZRomulatorSystemBuilder} instance that has
   *        built the nes.
   */
  @ZTag(KnownSystem)
  public static nes() {
    return new ZRomulatorSystemBuilder()
      .id(ZRomulatorSystemId.Nintendo)
      .console()
      .name("Nintendo Entertainment System")
      .alias("Famicom")
      .alias("NES")
      .alias("Hyundai Comboy")
      .alias("Samurai Electronic TV Game System")
      .alias("Dendy")
      .generation(3)
      .manufacturer("Nintendo");
  }

  /**
   * Creates a system that represents the Super
   * Nintendo Entertainment System (SNES).
   *
   * @returns
   *        This instance.
   */
  @ZTag(KnownSystem)
  public static snes() {
    return new ZRomulatorSystemBuilder()
      .id(ZRomulatorSystemId.SuperNintendo)
      .console()
      .name("Super Nintendo Entertainment System")
      .alias("Super Nintendo")
      .alias("Super Famicom")
      .alias("SNES")
      .alias("Super NES")
      .alias("Super Comboy")
      .generation(4)
      .manufacturer("Nintendo");
  }

  /**
   * Creates a system that represents the Nintendo
   * 64 (N64).
   *
   * @returns
   *        This instance.
   */
  @ZTag(KnownSystem)
  public static n64() {
    return new ZRomulatorSystemBuilder()
      .id(ZRomulatorSystemId.Nintendo64)
      .console()
      .name("Nintendo 64")
      .alias("N64")
      .alias("Ultra 64")
      .alias("Hyundai Comboy 64")
      .generation(5)
      .manufacturer("Nintendo");
  }

  /**
   * Creates a system that represents the Nintendo
   * GameCube (GC).
   *
   * @returns
   *        This instance.
   */
  @ZTag(KnownSystem)
  public static gc() {
    return new ZRomulatorSystemBuilder()
      .id(ZRomulatorSystemId.GameCube)
      .console()
      .name("Nintendo GameCube")
      .alias("GameCube")
      .alias("Dolphin")
      .generation(6)
      .manufacturer("Nintendo")
      .manufacturer("Foxconn");
  }

  /**
   * Creates a system that represents the Nintendo
   * Wii (Wii).
   *
   * @returns
   *        This instance.
   */
  @ZTag(KnownSystem)
  public static wii() {
    return new ZRomulatorSystemBuilder()
      .id(ZRomulatorSystemId.Wii)
      .console()
      .name("Nintendo Wii")
      .alias("Wii")
      .alias("Revolution")
      .generation(7)
      .manufacturer("Foxconn");
  }

  /**
   * Creates a system that represents the Nintendo
   * Wii U (WiiU).
   *
   * @returns
   *        This instance.
   */
  @ZTag(KnownSystem)
  public static wiiu() {
    return new ZRomulatorSystemBuilder()
      .id(ZRomulatorSystemId.WiiU)
      .console()
      .name("Nintendo Wii U")
      .alias("WiiU")
      .alias("Project Cafe")
      .generation(8)
      .manufacturer("Nintendo")
      .manufacturer("Foxconn")
      .manufacturer("Mitsumi");
  }

  /**
   * Creates a system that represents the Nintendo
   * Switch (Switch).
   *
   * @returns
   *        This instance.
   */
  @ZTag(KnownSystem)
  public static switch() {
    return new ZRomulatorSystemBuilder()
      .id(ZRomulatorSystemId.Switch)
      .console()
      .name("Nintendo Switch")
      .alias("Switch")
      .alias("NX")
      .alias("HAC")
      .alias("Odin")
      .generation(9)
      .manufacturer("Foxconn")
      .manufacturer("Hosiden");
  }

  /**
   * Creates a system from an id slug.
   *
   * @param id -
   *        The id slug of the system to create.
   *
   * @return
   *        The system, or null if the id is not known.
   */
  public static from(id: string): ZRomulatorSystemBuilder | null {
    if (isTagged(KnownSystem, ZRomulatorSystemKnown, id)) {
      return ZRomulatorSystemKnown[id]();
    }

    return null;
  }
}
