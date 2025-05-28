import "reflect-metadata";

import { ZRomulatorSystemBuilder } from "./system";

const IS_SYSTEM = "z-romulator-is-system-method";

function KnownSystem(): MethodDecorator {
  return (_, __, descriptor) => {
    Reflect.defineMetadata(IS_SYSTEM, true, descriptor.value!);
  };
}

function isKnownSystem(target: any): target is () => ZRomulatorSystemBuilder {
  return target != null && Reflect.getMetadata(IS_SYSTEM, target) === true;
}

/**
 * A helper factory class for creating supported systems.
 */
export abstract class ZRomulatorSystemKnown {
  /**
   * Creates a system that represents the Nintendo
   * Entertainment System (NES).
   *
   * @returns
   *        A {@link ZRomulatorSystemBuilder} instance that has
   *        built the nes.
   */
  @KnownSystem()
  public static nes() {
    return new ZRomulatorSystemBuilder()
      .id("nes")
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
  @KnownSystem()
  public static snes() {
    return new ZRomulatorSystemBuilder()
      .id("snes")
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
  @KnownSystem()
  public static n64() {
    return new ZRomulatorSystemBuilder()
      .id("n64")
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
  @KnownSystem()
  public static gc() {
    return new ZRomulatorSystemBuilder()
      .id("gc")
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
  @KnownSystem()
  public static wii() {
    return new ZRomulatorSystemBuilder()
      .id("wii")
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
  @KnownSystem()
  public static wiiu() {
    return new ZRomulatorSystemBuilder()
      .id("wiiu")
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
  @KnownSystem()
  public static switch() {
    return new ZRomulatorSystemBuilder()
      .id("switch")
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
    const system = ZRomulatorSystemKnown[id];

    if (isKnownSystem(system)) {
      return system();
    }

    return null;
  }
}
