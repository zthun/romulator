import type { IZCircusDriver, IZCircusSetup } from "@zthun/cirque";
import { ZCircusBy } from "@zthun/cirque";
import { ZCircusSetupRenderer } from "@zthun/cirque-du-react";
import {
  ZNotFound,
  ZRoute,
  ZRouteMap,
  ZTestRouter,
} from "@zthun/fashion-boutique";
import { required } from "@zthun/helpful-fn";
import {
  ZDataRequestBuilder,
  ZDataSourceStatic,
  ZFilterBinaryBuilder,
} from "@zthun/helpful-query";
import type { IZRomulatorGame } from "@zthun/romulator-client";
import {
  ZRomulatorGameBuilder,
  ZRomulatorSystemBuilder,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import type { History } from "history";
import { createMemoryHistory } from "history";
import { noop } from "lodash-es";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";
import {
  ZRomulatorGamesServiceContext,
  type IZRomulatorGamesService,
} from "../games/games-service.mjs";
import { ZRomulatorSystemPageComponentModel } from "./system-page.cm.mjs";
import { ZRomulatorSystemPage } from "./system-page.js";
import type { IZRomulatorSystemsService } from "./systems-service.mjs";
import { ZRomulatorSystemsServiceContext } from "./systems-service.mjs";

interface ZRomulatorSystemPageProps {
  history?: History;
}

describe("SystemPage", () => {
  const nes = new ZRomulatorSystemBuilder()
    .id(ZRomulatorSystemId.Nintendo)
    .name("Nintendo Entertainment System")
    .build();

  const batman = new ZRomulatorGameBuilder()
    .id("nes-batman")
    .name("Batman")
    .system(ZRomulatorSystemId.Nintendo)
    .build();
  const mario = new ZRomulatorGameBuilder()
    .id("nes-super-mario-bros")
    .name("Super Mario Bros.")
    .system(ZRomulatorSystemId.Nintendo)
    .build();
  const superMetroid = new ZRomulatorGameBuilder()
    .id("snes-super-metroid")
    .name("Super Metroid")
    .system(ZRomulatorSystemId.SuperNintendo)
    .build();

  let _driver: IZCircusDriver;
  let _renderer: IZCircusSetup;
  let _systems: Mocked<IZRomulatorSystemsService>;
  let _games: Mocked<IZRomulatorGamesService>;

  beforeEach(() => {
    const source = new ZDataSourceStatic([nes]);

    _systems = mock<IZRomulatorSystemsService>();
    _systems.get.mockImplementation(async (id) => {
      const byId = new ZFilterBinaryBuilder()
        .subject("id")
        .equal()
        .value(id)
        .build();
      const request = new ZDataRequestBuilder().filter(byId).build();
      const [item] = await source.retrieve(request);

      return required(item);
    });

    const __games = new ZDataSourceStatic<IZRomulatorGame>([
      batman,
      mario,
      superMetroid,
    ]);

    _games = mock<IZRomulatorGamesService>();
    _games.retrieve.mockImplementation(async (req) => __games.retrieve(req));
    _games.count.mockImplementation(async (req) => __games.count(req));
  });

  afterEach(async () => {
    await _driver?.destroy?.call(_driver);
    await _renderer?.destroy?.call(_renderer);
  });

  function createSystemMemoryHistory(system: string) {
    return createMemoryHistory({ initialEntries: [`/systems/${system}`] });
  }

  async function createTestTarget(props: ZRomulatorSystemPageProps = {}) {
    const { history = createSystemMemoryHistory(nes.id) } = props;

    const element = (
      <ZRomulatorSystemsServiceContext value={_systems}>
        <ZRomulatorGamesServiceContext value={_games}>
          <ZTestRouter navigator={history} location={history.location}>
            <ZRouteMap>
              <ZRoute path="/systems/:id" element={<ZRomulatorSystemPage />} />
              <ZRoute path="*" element={<ZNotFound />} />
            </ZRouteMap>
          </ZTestRouter>
        </ZRomulatorGamesServiceContext>
      </ZRomulatorSystemsServiceContext>
    );

    _renderer = new ZCircusSetupRenderer(element);
    _driver = await _renderer.setup();
    return ZCircusBy.first(_driver, ZRomulatorSystemPageComponentModel);
  }

  describe("Loading", () => {
    it("should show a loading indicator while the system is loading", async () => {
      // Arrange.
      _systems.get.mockReturnValue(new Promise(noop));
      const target = await createTestTarget();

      // Act.
      const actual = await target.loading();

      // Assert.
      expect(actual).toBeTruthy();
    });
  });

  describe("Error", () => {
    it("should show an error alert if the system cannot be found", async () => {
      // Arrange.
      const history = createSystemMemoryHistory("does-not-exist");
      const target = await createTestTarget({ history });
      await target.load();

      // Act.
      const actual = await target.error();

      // Assert.
      expect(actual).toBeTruthy();
    });
  });

  describe("System", () => {
    it("should render the system information card", async () => {
      // Arrange.
      const target = await createTestTarget();
      await target.load();

      // Act.
      const actual = await target.system();

      // Assert.
      expect(actual).toBeTruthy();
    });

    it("should render the games list", async () => {
      // Arrange.
      const target = await createTestTarget();
      await target.load();

      // Act.
      const actual = target.games();

      // Assert.
      expect(actual).toBeTruthy();
    });
  });

  describe("Games", () => {
    it("should only load games that are assigned to the given system", async () => {
      // Arrange.
      const target = await createTestTarget();
      await target.load();
      const games = await target.games();
      await games?.load();

      // Act.
      const _batman = await target.game(batman.id);
      const _mario = await target.game(mario.id);
      const _metroid = await target.game(superMetroid.id);

      // Assert.
      expect(_batman).toBeTruthy();
      expect(_mario).toBeTruthy();
      expect(_metroid).toBeFalsy();
    });

    it("should navigate to the games page when clicked", async () => {
      // Arrange.
      const history = createSystemMemoryHistory(nes.id);
      const target = await createTestTarget({ history });
      await target.load();
      const games = await target.games();
      await games?.load();

      // Act.
      const _batman = await target.game(batman.id);
      await _batman?.click();

      // Assert.
      expect(history.location.pathname).toEqual(`/games/${batman.id}`);
    });
  });
});
