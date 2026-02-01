import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { firstDefined } from "@zthun/helpful-fn";
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
import { type IZJob } from "@zthun/romulator-client";
import type { IZRestfulGet } from "@zthun/webigail-rest";
import {
  ZRomulatorJobsRepositoryToken,
  type IZRomulatorJobsRepository,
} from "./jobs-repository.mjs";

export const ZRomulatorJobsToken = Symbol("romulator-jobs-service");

export interface IZRomulatorJobsService extends IZRestfulGet<IZJob> {
  list(req: IZDataRequest): Promise<IZPage<IZJob>>;
}

@Injectable()
export class ZRomulatorJobsService implements IZRomulatorJobsService {
  private _logger: IZLogger;

  public constructor(
    @Inject(ZLoggerToken)
    logger: IZLogger,
    @Inject(ZRomulatorJobsRepositoryToken)
    private _files: IZRomulatorJobsRepository,
  ) {
    this._logger = new ZLoggerContext("ZRomulatorJobsService", logger);
  }

  public async list(req: IZDataRequest): Promise<IZPage<IZJob>> {
    let msg = "Querying jobs";
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const sort = new ZSortBuilder()
      .sorts(firstDefined([], req.sort))
      .ascending("createdAt")
      .build();
    const options = new ZDataSourceStaticOptionsBuilder<IZJob>()
      .search(new ZDataSearchFields())
      .build();

    const time = new Date();
    const jobs = await this._files.jobs();
    const span = new Date().getTime() - time.getTime();
    msg = `Found ${jobs.length} jobs. Search took ${span} milliseconds`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    const source = new ZDataSourceStatic(jobs, options);
    const request = new ZDataRequestBuilder().copy(req).sort(sort).build();
    const data = await source.retrieve(request);
    const count = await source.count(request);

    return new ZPageBuilder<IZJob>().data(data).count(count).build();
  }

  public async get(id: string): Promise<IZJob> {
    const time = new Date();
    let msg = `Searching for job with id, ${id}`;

    const jobs = await this._files.jobs();
    const [candidate] = jobs.filter((j) => j.id === id);
    const span = new Date().getTime() - time.getTime();

    if (candidate == null) {
      msg = `Job, ${id}, was not found.`;
      this._logger.log(new ZLogEntryBuilder().warning().message(msg).build());
      throw new NotFoundException(msg);
    }

    msg = `Found ${candidate.type} job after ${span} milliseconds`;
    this._logger.log(new ZLogEntryBuilder().info().message(msg).build());

    return candidate;
  }
}
