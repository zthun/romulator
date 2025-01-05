import { IZDataRequest, IZDataSource } from "@zthun/helpful-query";
import { IZRomulatorSystem } from "@zthun/romulator";
import { IZHttpService, ZHttpService } from "@zthun/webigail-http";
import {
  IZRestfulGet,
  IZRestfulService,
  ZRestfulService,
} from "@zthun/webigail-rest";
import { ZUrlBuilder } from "@zthun/webigail-url";
import { createContext, useContext } from "react";

export interface IZRomulatorSystemsService
  extends IZRestfulGet<IZRomulatorSystem>,
    IZDataSource<IZRomulatorSystem> {}

export class ZRomulatorSystemsService implements IZRomulatorSystemsService {
  private _rest: IZRestfulService<IZRomulatorSystem>;

  public static endpoint() {
    return new ZUrlBuilder()
      .protocol("http")
      .hostname("localhost")
      .port(3000)
      .append("api")
      .append("systems")
      .build();
  }

  public constructor(_http: IZHttpService) {
    this._rest = new ZRestfulService(
      _http,
      ZRomulatorSystemsService.endpoint(),
    );
  }

  public async retrieve(request: IZDataRequest): Promise<IZRomulatorSystem[]> {
    return this._rest.retrieve(request);
  }

  public async count(request: IZDataRequest): Promise<number> {
    return this._rest.count(request);
  }

  public async get(id: string): Promise<IZRomulatorSystem> {
    return this._rest.get(id);
  }
}

export function createDefaultSystemsService(): IZRomulatorSystemsService {
  return new ZRomulatorSystemsService(new ZHttpService());
}

export const ZRomulatorSystemsServiceContext = createContext(
  createDefaultSystemsService(),
);

export const useSystemsService = () =>
  useContext(ZRomulatorSystemsServiceContext);
