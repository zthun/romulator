import { ZLazy } from "@zthun/helpful-fn";
import type { IZDataRequest, IZDataSource } from "@zthun/helpful-query";
import { useAsyncState } from "@zthun/helpful-react";
import type { IZRomulatorSystem } from "@zthun/romulator-client";
import type { IZHttpService } from "@zthun/webigail-http";
import { ZHttpService } from "@zthun/webigail-http";
import type { IZRestfulGet, IZRestfulService } from "@zthun/webigail-rest";
import { ZRestfulService } from "@zthun/webigail-rest";
import { ZUrlBuilder } from "@zthun/webigail-url";
import { createContext, use } from "react";

import { ZRomulatorEnvironmentBuilder } from "../environment/environment.mjs";

export interface IZRomulatorSystemsService
  extends IZRestfulGet<IZRomulatorSystem>, IZDataSource<IZRomulatorSystem> {}

export class ZRomulatorSystemsService implements IZRomulatorSystemsService {
  private _rest: ZLazy<IZRestfulService<IZRomulatorSystem>>;

  public endpoint() {
    const { api } = new ZRomulatorEnvironmentBuilder().build();
    return new ZUrlBuilder().parse(api).append("systems").build();
  }

  public constructor(_http: IZHttpService) {
    this._rest = new ZLazy(async () =>
      Promise.resolve(new ZRestfulService(_http, this.endpoint())),
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

export const useSystemsService = () => use(ZRomulatorSystemsServiceContext);

export const useSystem = (id: string) => {
  const service = useSystemsService();

  return useAsyncState(() => service.get(id), [id]);
};
