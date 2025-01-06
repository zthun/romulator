import { ZLazy } from "@zthun/helpful-fn";
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
  private _rest: ZLazy<IZRestfulService<IZRomulatorSystem>>;

  public async endpoint() {
    return new ZUrlBuilder()
      .protocol("http")
      .hostname("localhost")
      .port(3000)
      .append("api")
      .append("systems")
      .build();
  }

  public constructor(_http: IZHttpService) {
    this._rest = new ZLazy(async () =>
      Promise.resolve(new ZRestfulService(_http, await this.endpoint())),
    );
  }

  public async retrieve(request: IZDataRequest): Promise<IZRomulatorSystem[]> {
    return (await this._rest.get()).retrieve(request);
  }

  public async count(request: IZDataRequest): Promise<number> {
    return (await this._rest.get()).count(request);
  }

  public async get(id: string): Promise<IZRomulatorSystem> {
    return (await this._rest.get()).get(id);
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
