import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  type IZDataRequestQuery,
  ZDataRequestBuilder,
} from "@zthun/helpful-query";
import { ZHttpCodeClient, ZHttpCodeSuccess } from "@zthun/webigail-http";

import type { IZRomulatorJobsService } from "./jobs-service.mjs";
import { ZRomulatorJobsToken } from "./jobs-service.mjs";

@ApiTags("Jobs")
@Controller("jobs")
export class ZRomulatorJobsController {
  public constructor(
    @Inject(ZRomulatorJobsToken)
    private readonly _jobs: IZRomulatorJobsService,
  ) {}

  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1,
    description: "Page number (1-based)",
  })
  @ApiQuery({
    name: "size",
    required: false,
    type: Number,
    example: 20,
    description: "Items per page.  Defaults to Infinity",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search query",
  })
  @ApiQuery({
    name: "sort",
    required: false,
    type: String,
    description: "Sort criterion",
  })
  @ApiQuery({
    name: "filter",
    required: false,
    type: String,
    description: "Filter criterion",
  })
  @ApiResponse({
    status: ZHttpCodeSuccess.OK,
    description: "Returns the requested page of jobs and the total count",
  })
  @Get()
  public list(@Query() params: IZDataRequestQuery) {
    const request = new ZDataRequestBuilder().query(params).build();
    return this._jobs.list(request);
  }

  @ApiParam({
    type: "string",
    name: "id",
    description: "The id of the job",
  })
  @ApiResponse({
    status: ZHttpCodeSuccess.OK,
    description: "Returns the job by id",
  })
  @ApiResponse({
    status: ZHttpCodeClient.NotFound,
    description: "Job not found",
  })
  @Get(":id")
  public get(@Param("id") id: string) {
    return this._jobs.get(id);
  }
}
