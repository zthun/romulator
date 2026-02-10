import {
  ZFileRepository,
  ZStreamFile,
  ZStreamFolder,
} from "@zthun/crumbtrail-fs";
import { tryJsonParse } from "@zthun/helpful-fn";
import { ZDataRequestBuilder } from "@zthun/helpful-query";
import type { IZJob } from "@zthun/romulator-client";
import { ZJobBuilder, ZJobType } from "@zthun/romulator-client";
import { get } from "lodash-es";
import { ZDir } from "../dir/dir.js";

export const ZRomulatorJobsRepositoryToken = Symbol("jobs-repository");

/**
 * Represents a repository for job data.
 */
export interface IZRomulatorJobsRepository {
  /**
   * Initializes the repository.
   *
   * This will setup the watch of the jobs directory and
   * will then cancel all in progress jobs that cannot
   * be resumed.
   */
  init(): Promise<void>;

  /**
   * Gets all jobs in the repository.
   *
   * @returns
   *      All jobs that are in the jobs folder.
   *      See {@link ZDir.jobs} for the location
   *      of the jobs folder.
   */
  jobs(): Promise<IZJob[]>;
}

/**
 * The implementation of the IZRomulatorJobsRepository.
 */
export class ZRomulatorJobsRepository implements IZRomulatorJobsRepository {
  private _files = new ZFileRepository();
  private _stream = new ZStreamFile();

  public async init() {
    const dir = ZDir.jobs();
    await new ZStreamFolder().write(dir);
    await this._files.initialize(dir, ["**/*.rjb"]);
  }

  public async jobs(): Promise<IZJob[]> {
    const req = new ZDataRequestBuilder().build();
    const candidates = await this._files.retrieve(req);

    // Most of these will be cached by the file stream the
    // first time this method is invoked. Job files are generally
    // VERY small (less than 100kb).
    const streams = candidates
      .map((node) => node.path)
      .map((path) => this._stream.read(path));

    const results = await Promise.allSettled(streams);
    const jobs: IZJob[] = [];

    for (let i = 0; i < results.length; ++i) {
      const file = candidates[i];
      const result = results[i];
      const value = get(result, "value")?.toString("utf-8");
      const content = tryJsonParse(value);

      const job = new ZJobBuilder()
        .id(file.title)
        .createdAt(file.created)
        .parse(content)
        .build();

      const { type = ZJobType.Unknown } = job;

      if (type !== ZJobType.Unknown) {
        jobs.push(job);
      }
    }

    return jobs;
  }
}
