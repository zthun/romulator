import type { IZDataSource } from "@zthun/helpful-query";
import type { IZJob } from "@zthun/romulator-client";
import { ZHttpService } from "@zthun/webigail-http";
import { type IZRestfulGet, ZRestfulService } from "@zthun/webigail-rest";
import { ZUrlBuilder } from "@zthun/webigail-url";
import { createContext, useContext } from "react";

import { ZRomulatorEnvironmentBuilder } from "../environment/environment.mjs";

/**
 * A service that retrieves jobs.
 */
export interface IZRomulatorJobsService
  extends IZRestfulGet<IZJob>, IZDataSource<IZJob> {}

/**
 * Creates the default implementation of the jobs service.
 *
 * @returns
 *        The default implementation of the jobs service
 */
export function createDefaultJobsService(): IZRomulatorJobsService {
  const { api } = new ZRomulatorEnvironmentBuilder().build();
  const endpoint = new ZUrlBuilder().parse(api).append("jobs").build();
  const http = new ZHttpService();
  return new ZRestfulService<IZJob>(http, endpoint);
}

/**
 * The injection context for the jobs service.
 */
export const ZRomulatorJobsServiceContext = createContext(
  createDefaultJobsService(),
);

/**
 * Returns the current injectable {@link IZRomulatorJobsService} implementation.
 *
 * @returns
 *        The current service implementation to manage jobs
 */
export const useJobsService = () => useContext(ZRomulatorJobsServiceContext);
