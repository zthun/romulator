import type {
  IZRomulatorGame,
  IZRomulatorSystem,
  ZRomulatorGameMediaType,
  ZRomulatorMediaType,
  ZRomulatorSystemMediaType,
} from "@zthun/romulator-client";
import { ZUrlBuilder } from "@zthun/webigail-url";
import { createContext, useContext } from "react";
import {
  ZRomulatorEnvironmentBuilder,
  type IZRomulatorEnvironment,
} from "../environment/environment.mjs";

/**
 * A service that retrieves media.
 */
export interface IZRomulatorMediaService {
  /**
   * The url for a system media entity.
   *
   * @param target -
   *        The target system to get the media for.
   * @param type -
   *        The type of media to retrieve.
   *
   * @returns
   *        The media endpoint url that points to the system
   *        media, regardless of whether it exists.
   */
  url(target: IZRomulatorSystem, type: ZRomulatorSystemMediaType): string;

  /**
   * The url for a game media entity.
   *
   * @param target -
   *        The target game to get the media for.
   * @param type -
   *        The type of media to retrieve.
   *
   * @returns
   *        The media endpoint url that points to the game
   *        media, regardless of whether it exists.
   */
  url(target: IZRomulatorGame, type: ZRomulatorGameMediaType): string;
}

/**
 * An implementation of the IZRomulatorMediaService.
 */
export class ZRomulatorMediaService implements IZRomulatorMediaService {
  public static readonly Endpoint = "media";

  /**
   * Initializes a new instance of this object.
   *
   * @param _environment -
   *        The environment service.
   */
  public constructor(private readonly _environment: IZRomulatorEnvironment) {}

  public url(
    target: IZRomulatorSystem | IZRomulatorGame,
    type: ZRomulatorMediaType,
  ): string {
    const id = `${target.id}-${type}`;
    return new ZUrlBuilder()
      .parse(this._environment.api)
      .append("media")
      .append(id)
      .build();
  }
}

export function createDefaultMediaService(): IZRomulatorMediaService {
  const environment = new ZRomulatorEnvironmentBuilder().build();
  return new ZRomulatorMediaService(environment);
}

export const ZRomulatorMediaServiceContext = createContext(
  createDefaultMediaService(),
);

export const useMediaService = () => useContext(ZRomulatorMediaServiceContext);
