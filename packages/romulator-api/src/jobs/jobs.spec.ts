import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZLoggerSilent, type IZLogger } from "@zthun/lumberjacky-log";
import { ZLoggerToken } from "@zthun/lumberjacky-nest";
import { ZJobBuilder, ZJobType } from "@zthun/romulator-client";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZDir } from "../dir/dir.js";
import { ZRomulatorJobsController } from "./jobs-controller.mjs";
import { ZRomulatorJobsModule } from "./jobs-module.mjs";

describe("JobsApi", () => {
  const assets = resolve(__dirname, "../../.test.jobs");

  let _logger: IZLogger;
  let _controller: ZRomulatorJobsController;

  const spy = () => vi.spyOn(ZDir, "jobs").mockReturnValue(assets);

  const writeJob = async (job = new ZJobBuilder().id("id").build()) => {
    const now = new Date();
    const year = `${now.getFullYear()}`;
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    const destination = join(assets, year, month, day);
    await mkdir(destination, { recursive: true });
    const file = join(destination, `${job.id}.json`);
    await writeFile(file, JSON.stringify(job));
    return file;
  };

  const createTestTarget = async () => {
    const module = await Test.createTestingModule({
      imports: [ZRomulatorJobsModule],
    })
      .overrideProvider(ZLoggerToken)
      .useValue(_logger)
      .compile();

    _controller = module.get(ZRomulatorJobsController);
  };

  beforeEach(async () => {
    _logger = new ZLoggerSilent();
    spy();
    await createTestTarget();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(assets, { recursive: true, force: true });
  });

  describe("List", () => {
    it("should list all jobs", async () => {
      // Arrange.
      const one = new ZJobBuilder().id("a-job").type(ZJobType.Ping).build();
      const two = new ZJobBuilder().id("b-job").type(ZJobType.Ping).build();
      await writeJob(one);
      await writeJob(two);

      // Act.
      const page = await _controller.list({});

      // Assert.
      expect(page.data).toEqual([one, two]);
      expect(page.count).toEqual(2);
    });
  });

  describe("Get", () => {
    it("should retrieve a job by id", async () => {
      // Arrange.
      const expected = new ZJobBuilder().id("ping").type(ZJobType.Ping).build();
      await writeJob(expected);

      // Act.
      const actual = await _controller.get(expected.id as string);

      // Assert.
      expect(actual).toEqual(expected);
    });

    it("should return not found if the job is missing", async () => {
      await expect(_controller.get("unknown")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe("Create", () => {
    it("should create a ping job in the background", async () => {
      // Act.
      const result = await _controller.create({ type: ZJobType.Ping });

      // Assert.
      expect(result.type).toEqual(ZJobType.Ping);
      const now = new Date();
      const year = `${now.getFullYear()}`;
      const month = `${now.getMonth() + 1}`.padStart(2, "0");
      const day = `${now.getDate()}`.padStart(2, "0");
      const path = join(assets, year, month, day, `${result.id}.json`);

      const start = Date.now();
      const timeout = 2000;
      let content = "{}";

      while (Date.now() - start < timeout) {
        try {
          content = await readFile(path, "utf-8");
          break;
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }

      const saved = JSON.parse(content);
      expect(saved.id).toEqual(result.id);
      expect(saved.type).toEqual(ZJobType.Ping);
    });

    it("should reject unsupported job types", async () => {
      await expect(
        _controller.create({ type: "unsupported" as ZJobType }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe("Delete", () => {
    it("should delete a job by id", async () => {
      // Arrange.
      const job = new ZJobBuilder().id("delete-me").type(ZJobType.Ping).build();
      const file = await writeJob(job);

      // Act.
      await _controller.delete(job.id as string);

      // Assert.
      await expect(readFile(file, "utf-8")).rejects.toBeTruthy();
    });
  });
});
