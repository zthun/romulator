import { IZCircusDriver, IZCircusSetup, ZCircusBy } from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import { ZTestRouter } from "@zthun/fashion-boutique";
import { ZDataSourceStatic } from "@zthun/helpful-query";
import { ZRomulatorSystemBuilder } from "@zthun/romulator";
import { createMemoryHistory, MemoryHistory } from "history";
import { afterEach, beforeEach, describe, expect, it, Mocked } from "vitest";
import { mock } from "vitest-mock-extended";
import { ZRomulatorSystemsPage } from "./systems-page";
import { ZRomulatorSystemsPageComponentModel } from "./systems-page.cm.mjs";
import {
  IZRomulatorSystemsService,
  ZRomulatorSystemsServiceContext,
} from "./systems-service.mjs";

describe("ZRomulatorSystemsPage", () => {
  const nes = new ZRomulatorSystemBuilder().nes().build();
  const snes = new ZRomulatorSystemBuilder().snes().build();
  const systems = [nes, snes];

  let _systemsService: Mocked<IZRomulatorSystemsService>;
  let _renderer: IZCircusSetup | undefined;
  let _driver: IZCircusDriver | undefined;
  let _history: MemoryHistory;

  afterEach(async () => {
    await _driver?.destroy?.call(_driver);
    await _renderer?.destroy?.call(_renderer);
  });

  beforeEach(() => {
    const source = new ZDataSourceStatic(systems);

    _systemsService = mock<IZRomulatorSystemsService>();
    _systemsService.retrieve.mockImplementation(source.retrieve.bind(source));
    _systemsService.count.mockImplementation(source.count.bind(source));

    _history = createMemoryHistory();
  });

  const createTestTarget = async () => {
    const element = (
      <ZTestRouter navigator={_history} location={_history.location}>
        <ZRomulatorSystemsServiceContext value={_systemsService}>
          <ZRomulatorSystemsPage />
        </ZRomulatorSystemsServiceContext>
      </ZTestRouter>
    );

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();

    return ZCircusBy.first(_driver, ZRomulatorSystemsPageComponentModel);
  };

  it("should render all systems", async () => {
    // Arrange.
    const target = await createTestTarget();
    const expected = systems.map((s) => s.id);

    // Act.
    const cards = await target.systems();
    const actual = await Promise.all(cards.map((s) => s.id()));

    // Assert.
    expect(actual).toEqual(expected);
  });

  it("should navigate me to the games page when I click on a see games button", async () => {
    // Arrange.
    const target = await createTestTarget();
    const system = await target.system(nes.id);

    // Act.
    const games = await system?.games();
    await games?.click();

    // Assert.
    expect(_history.location.pathname).toEqual(`/systems/${nes.id}`);
  });
});
