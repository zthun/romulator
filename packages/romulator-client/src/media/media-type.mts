/**
 * Describes what a specific piece of media represents.
 */
export enum ZRomulatorMediaType {
  /**
   * A 3d representation of the box art.
   */
  Game3dBox = "game-3d-box",
  /**
   * Back of the game box.
   */
  GameBackCover = "game-back-cover",
  /**
   * Front of the game box.
   */
  GameCover = "game-cover",
  /**
   * Fan art.
   */
  GameFanArt = "game-fan-art",
  /**
   * Game manual.
   */
  GameManual = "game-manual",
  /**
   * A marquee of a game.
   */
  GameMarquee = "game-marquee",
  /**
   * The cartridge or disc label.
   */
  GamePhysicalMedia = "game-physical-media",
  /**
   * An in game screenshot showcasing gameplay.
   */
  GameScreenshot = "game-screenshot",
  /**
   * An in game screenshot of the title screen.
   */
  GameTitle = "game-title",
  /**
   * A video showcasing the game.
   */
  GameVideo = "game-video",
  /**
   * The game wheel.
   *
   * This is the logo for the game.
   */
  GameWheel = "game-wheel",
  /**
   * An image of a system's controller.
   */
  SystemController = "system-controller",
  /**
   * A icon for the system.
   *
   * These are normally 32x32.
   */
  SystemIcon = "system-icon",
  /**
   * An illustration of the system.
   */
  SystemIllustration = "system-illustration",
  /**
   * A picture of the system.
   *
   * These are real life looking photos of what
   * a system looks like.
   */
  SystemPicture = "system-picture",
  /**
   * A wheel for a system.
   *
   * This is basically the logo.
   */
  SystemWheel = "system-wheel",
}
