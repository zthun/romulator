import type { IZDataSource } from "@zthun/helpful-query";
import { useAsyncState } from "@zthun/helpful-react";
import type { IZRomulatorGame } from "@zthun/romulator-client";
import { ZHttpService } from "@zthun/webigail-http";
import type { IZRestfulGet } from "@zthun/webigail-rest";
import { ZRestfulService } from "@zthun/webigail-rest";
import { ZUrlBuilder } from "@zthun/webigail-url";
import { createContext, use } from "react";

import { ZRomulatorEnvironmentBuilder } from "../environment/environment.mjs";

export interface IZRomulatorGamesService
  extends IZRestfulGet<IZRomulatorGame>, IZDataSource<IZRomulatorGame> {}

export function createDefaultGamesService(): IZRomulatorGamesService {
  const { api } = new ZRomulatorEnvironmentBuilder().build();
  const endpoint = new ZUrlBuilder().parse(api).append("games").build();
  const http = new ZHttpService();
  return new ZRestfulService<IZRomulatorGame>(http, endpoint);
}

export const ZRomulatorGamesServiceContext = createContext(
  createDefaultGamesService(),
);

export const useGamesService = () => use(ZRomulatorGamesServiceContext);

export const useGame = (id: string) => {
  const service = useGamesService();

  return useAsyncState(() => service.get(id), [id]);
};
