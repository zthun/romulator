import { rm } from "node:fs/promises";
import { resolve } from "node:path";

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZStreamFile } from "@zthun/crumbtrail-fs";
import { createGuid } from "@zthun/helpful-fn";
import { ZFilterBinaryBuilder, ZFilterSerialize } from "@zthun/helpful-query";
import { ZLoggerSilent } from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import type { IZJob } from "@zthun/romulator-client";
import { ZJobBuilder, ZJobType } from "@zthun/romulator-client";
import { ZHttpCodeClient, ZHttpCodeSuccess } from "@zthun/webigail-http";
import request from "supertest";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { ZDir } from "../dir/dir.js";
import { ZRomulatorJobsModule } from "./jobs-module.mjs";

describe.sequential("JobsApi", () => {
  const endpoint = "jobs";
  const stream = new ZStreamFile({ cache: { maxFiles: 0 } });
  const jobsFolder = resolve(__dirname, "../../.test.jobs");

  let _target: INestApplication | undefined;

  const createJobFile = (id = createGuid()) => {
    return resolve(jobsFolder, `${id}.rjb`);
  };

  const writeJob = async (job: IZJob) => {
    const withId = new ZJobBuilder().copy(job).guid().build();
    const redacted = new ZJobBuilder().copy(withId).redact().build();
    const buffer = Buffer.from(JSON.stringify(redacted));
    await stream.write(createJobFile(withId.id), { buffer });
  };

  const createTestTarget = async () => {
    const module = await Test.createTestingModule({
      imports: [ZRomulatorJobsModule],
    })
      .overrideProvider(ZLoggerToken)
      .useValue(new ZLoggerSilent())
      .compile();

    _target = module.createNestApplication();
    await _target.init();

    return _target;
  };

  beforeAll(() => {
    vi.spyOn(ZDir, "jobs").mockReturnValue(jobsFolder);
  });

  afterEach(async () => {
    await _target?.close();
  });

  afterAll(async () => {
    vi.restoreAllMocks();
    await rm(jobsFolder, { recursive: true, force: true });
  });

  describe("List", () => {
    const ping = new ZJobBuilder().ping().build();
    const scrape = new ZJobBuilder().scrape().build();

    beforeAll(async () => {
      await rm(jobsFolder, { recursive: true, force: true });

      await writeJob(ping);
      await writeJob(scrape);

      // Empty files should be ignored.
      await stream.write(createJobFile());

      // Binary, non json should be ignored.
      const binary = Buffer.from([0x33, 0x46, 0x55]);
      await stream.write(createJobFile(), { buffer: binary });

      // Jobs with incorrect types should be ignored.
      const _unsupported = { id: createGuid(), type: "unsupported" };
      const unsupported = Buffer.from(JSON.stringify(_unsupported));
      await stream.write(createJobFile(), { buffer: unsupported });

      // Jobs that have invalid JSON should be ignored.
      const _badJson = '{ "id": "22", here-be-dragons: true }';
      const badJson = Buffer.from(_badJson);
      await stream.write(createJobFile(), { buffer: badJson });
    });

    it("should list all jobs in the jobs folder that represent jobs", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(`/${endpoint}`);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.count).toEqual(2);
    });

    it("should only list jobs that match a given filter", async () => {
      // Arrange.
      const filter = new ZFilterBinaryBuilder()
        .subject("type")
        .equal()
        .value(ZJobType.Ping)
        .build();
      const query = new ZFilterSerialize().serialize(filter);
      const url = `/${endpoint}?filter=${query}`;
      const target = await createTestTarget();

      // Act.
      const actual = await request(target.getHttpServer()).get(url);

      // Assert.
      expect(actual.status).toEqual(ZHttpCodeSuccess.OK);
      expect(actual.body.data.length).toEqual(1);
      expect(actual.body.data).toEqual([expect.objectContaining(ping)]);
    });
  });

  describe("Get", () => {
    const ping = new ZJobBuilder().guid().ping().build();

    beforeAll(async () => {
      await rm(jobsFolder, { recursive: true, force: true });

      await writeJob(ping);
    });

    it("should retrieve a job by id", async () => {
      // Arrange.
      const url = `/${endpoint}/${ping.id}`;
      const target = await createTestTarget();

      // Act.
      const result = await request(target.getHttpServer()).get(url);

      // Assert.
      expect(result.status).toEqual(ZHttpCodeSuccess.OK);
      expect(result.body).toEqual(expect.objectContaining(ping));
    });

    it("should return not found if the job is missing", async () => {
      // Arrange.
      const url = `/${endpoint}/no-job-should-have-this-id`;
      const target = await createTestTarget();

      // Act.
      const result = await request(target.getHttpServer()).get(url);

      // Assert.
      expect(result.status).toEqual(ZHttpCodeClient.NotFound);
    });
  });
});
