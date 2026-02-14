import {
  ZCircusBy,
  type IZCircusDriver,
  type IZCircusSetup,
} from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { ZTestRouter } from "@zthun/fashion-boutique";
import { ZDataSourceStatic } from "@zthun/helpful-query";
import { ZJobBuilder } from "@zthun/romulator-client";
import { createMemoryHistory } from "history";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";
import { ZRomulatorJobsPageComponentModel } from "./jobs-page.cm.mjs";
import { ZRomulatorJobsPage } from "./jobs-page.js";
import {
  ZRomulatorJobsServiceContext,
  type IZRomulatorJobsService,
} from "./jobs-service.js";

describe("ZRomulatorJobsPage", () => {
  let _renderer: IZCircusSetup | undefined;
  let _driver: IZCircusDriver | undefined;

  const now = new Date().toJSON();

  const alpha = new ZJobBuilder().guid().idle().createdAt(now).build();
  const bravo = new ZJobBuilder()
    .guid()
    .running()
    .createdAt(now)
    .percent(24)
    .build();
  const charlie = new ZJobBuilder().guid().canceled().build();
  const delta = new ZJobBuilder().guid().failed().build();
  const foxtrot = new ZJobBuilder().guid().success().build();
  const jobs = [alpha, bravo, charlie, delta, foxtrot];

  let service: Mocked<IZRomulatorJobsService>;

  beforeEach(() => {
    service = mock<IZRomulatorJobsService>();
    const source = new ZDataSourceStatic(jobs);

    service.retrieve.mockImplementation((r) => source.retrieve(r));
    service.count.mockImplementation((r) => source.count(r));
  });

  afterEach(async () => {
    await _driver?.destroy?.();
    await _renderer?.destroy?.();
  });

  const createTestTarget = async () => {
    const history = createMemoryHistory();

    const element = (
      <ZTestRouter location={history.location} navigator={history}>
        <ZRomulatorJobsServiceContext.Provider value={service}>
          <ZRomulatorJobsPage />;
        </ZRomulatorJobsServiceContext.Provider>
      </ZTestRouter>
    );

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZRomulatorJobsPageComponentModel);
  };

  it("should list all jobs", async () => {
    // Arrange.
    const target = await createTestTarget();

    // Act.
    const actual = await target.jobs();

    // Assert.
    expect(actual.length).toEqual(jobs.length);
  });
});
