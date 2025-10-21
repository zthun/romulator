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
      .name("Nintendo Entertainment System")
      .build();
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
      .name("Super Nintendo Entertainment System")
      .build();
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
      .name("Nintendo 64")
      .build();
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
      .name("Nintendo GameCube")
      .build();
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
      .name("Nintendo Wii")
      .build();
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
      .name("Nintendo Wii U")
      .build();
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
      .name("Nintendo Switch")
      .build();
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
  public static from(id: string): IZRomulatorSystem | null {
    if (isTagged(KnownSystem, ZRomulatorSystemKnown, id)) {
      return ZRomulatorSystemKnown[id]();
    }

    return null;
  }
}
