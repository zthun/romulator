import type { IZDataSource } from "@zthun/helpful-query";
import type { IZRomulatorConfig } from "@zthun/romulator-client";
import { ZHttpService } from "@zthun/webigail-http";
import {
  ZRestfulService,
  type IZRestfulGet,
  type IZRestfulUpdate,
} from "@zthun/webigail-rest";
import { createContext, useContext } from "react";
import { ZRomulatorEnvironmentBuilder } from "../environment/environment.mjs";

export interface IZRomulatorSettingsService
  extends IZDataSource<IZRomulatorConfig>,
    IZRestfulGet<IZRomulatorConfig>,
    IZDataSource<IZRomulatorConfig>,
    IZRestfulUpdate<IZRomulatorConfig> {}

export function createDefaultSettingsService(): IZRomulatorSettingsService {
  const env = new ZRomulatorEnvironmentBuilder().build();
  const http = new ZHttpService();
  const endpoint = `${env.api}/configs`;
  return new ZRestfulService(http, endpoint);
}

export const ZRomulatorSettingsContext = createContext(
  createDefaultSettingsService(),
);

export const useSettingsService = () => useContext(ZRomulatorSettingsContext);
