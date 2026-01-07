import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { createError, firstDefined } from "@zthun/helpful-fn";
import type { IZDataRequest, IZPage } from "@zthun/helpful-query";
import {
  ZDataRequestBuilder,
  ZDataSearchFields,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder,
  ZPageBuilder,
  ZSortBuilder,
} from "@zthun/helpful-query";
import {
  ZLogEntryBuilder,
  ZLoggerContext,
  type IZLogger,
} from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import { ZJobBuilder, ZJobType, type IZJob } from "@zthun/romulator-client";
import type {
  IZRestfulCreate,
  IZRestfulDelete,
  IZRestfulGet,
} from "@zthun/webigail-rest";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import { ZDir } from "../dir/dir.js";

export const ZRomulatorJobsToken = Symbol("romulator-jobs-service");

export interface IZRomulatorJobsService
  extends
    IZRestfulGet<IZJob<unknown>>,
    IZRestfulCreate<IZJob<unknown>>,
    IZRestfulDelete {
  list(req: IZDataRequest): Promise<IZPage<IZJob<unknown>>>;
}

interface IZJobEntry {
  path: string;
  job: IZJob<unknown>;
}

@Injectable()
export class ZRomulatorJobsService implements IZRomulatorJobsService {
  private _logger: IZLogger;

  public constructor(@Inject(ZLoggerToken) logger: IZLogger) {
    this._logger = new ZLoggerContext("ZRomulatorJobsService", logger);
  }

  private log(message: string) {
    this._logger.log(new ZLogEntryBuilder().info().message(message).build());
  }

  private logError(err: unknown) {
    const message = createError(err).message;
    this._logger.log(new ZLogEntryBuilder().error().message(message).build());
  }

  private jobPath(id: string, created: Date = new Date()) {
    const year = `${created.getFullYear()}`;
    const month = `${created.getMonth() + 1}`.padStart(2, "0");
    const day = `${created.getDate()}`.padStart(2, "0");
    return join(ZDir.jobs(), year, month, day, `${id}.json`);
  }

  private async writeJob(job: IZJob<unknown>, created = new Date()) {
    const path = this.jobPath(job.id as string, created);
    this.log(`Writing job, ${job.id}, to ${path}`);

    try {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, JSON.stringify(job));
    } catch (err) {
      this.logError(err);
    }
  }

  private async readJob(path: string): Promise<IZJob<unknown>> {
    const json = await readFile(path, "utf-8");
    const data = JSON.parse(json) as IZJob<unknown>;
    const id = firstDefined(basename(path, extname(path)), data.id);

    return new ZJobBuilder().copy(data).id(id).build();
  }

  private async readJobs(path: string): Promise<IZJobEntry[]> {
    const entries: IZJobEntry[] = [];
    try {
      const items = await readdir(path, { withFileTypes: true });

      for (const item of items) {
        const candidate = join(path, item.name);

        if (item.isDirectory()) {
          entries.push(...(await this.readJobs(candidate)));
          continue;
        }

        if (item.isFile() && candidate.endsWith(".json")) {
          entries.push({
            path: candidate,
            job: await this.readJob(candidate),
          });
        }
      }

      return entries;
    } catch (err: any) {
      if (err?.code !== "ENOENT") {
        this.logError(err);
      }
      return entries;
    }
  }

  private async findJob(id: string): Promise<IZJobEntry | null> {
    const jobs = await this.readJobs(ZDir.jobs());
    return jobs.find((entry) => entry.job.id === id) ?? null;
  }

  public async list(req: IZDataRequest): Promise<IZPage<IZJob<unknown>>> {
    this.log("Listing jobs");
    const jobs = (await this.readJobs(ZDir.jobs())).map(({ job }) => job);

    const options = new ZDataSourceStaticOptionsBuilder<IZJob<unknown>>()
      .search(new ZDataSearchFields())
      .build();
    const source = new ZDataSourceStatic(jobs, options);
    const sort = new ZSortBuilder()
      .sorts(firstDefined([], req.sort))
      .ascending("id")
      .build();
    const request = new ZDataRequestBuilder().copy(req).sort(sort).build();

    const data = await source.retrieve(request);
    const count = await source.count(request);

    return new ZPageBuilder<IZJob<unknown>>().data(data).count(count).build();
  }

  public async get(id: string): Promise<IZJob<unknown>> {
    this.log(`Retrieving job ${id}`);
    const match = await this.findJob(id);

    if (match == null) {
      const msg = `Job, ${id}, was not found.`;
      this.log(msg);
      throw new NotFoundException(msg);
    }

    return match.job;
  }

  public async create(body: IZJob<unknown>): Promise<IZJob<unknown>> {
    const { type: requestedType } = body;
    const id = randomUUID();

    if (requestedType && requestedType !== ZJobType.Ping) {
      throw new BadRequestException(
        `Unsupported job type. Only ${ZJobType.Ping} is supported.`,
      );
    }

    const type = firstDefined(requestedType, ZJobType.Ping);

    const job = new ZJobBuilder().copy(body).id(id).type(type).build();

    void this.writeJob(job);

    return job;
  }

  public async delete(id: string): Promise<void> {
    const match = await this.findJob(id);

    if (match == null) {
      const msg = `Job, ${id}, was not found.`;
      throw new NotFoundException(msg);
    }

    this.log(`Deleting job, ${id}, at ${match.path}`);
    await unlink(match.path);
  }
}
