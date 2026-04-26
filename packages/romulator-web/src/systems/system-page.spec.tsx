import type { IZCircusDriver, IZCircusSetup } from "@zthun/cirque";
import { ZCircusBy, ZCircusDestroy } from "@zthun/cirque";
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
  ZRomulatorSystemContentType,
  ZRomulatorSystemHardwareType,
  ZRomulatorSystemId,
  ZRomulatorSystemMediaFormat,
  ZRomulatorSystemMediaType,
} from "@zthun/romulator-client";
import type { History } from "history";
import { createMemoryHistory } from "history";
import { noop } from "lodash-es";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";

import {
  type IZRomulatorGamesService,
  ZRomulatorGamesServiceContext,
} from "../games/games-service.mjs";
import {
  type IZRomulatorMediaService,
  ZRomulatorMediaServiceContext,
} from "../media/media-service.js";
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
    .company("Nintendo")
    .hardware(ZRomulatorSystemHardwareType.Console)
    .mediaFormat(ZRomulatorSystemMediaFormat.Cartridge)
    .contentType(ZRomulatorSystemContentType.ReadOnlyMemory)
    .production(1983, 1995)
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
  let _media: Mocked<IZRomulatorMediaService>;

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

    _media = mock<IZRomulatorMediaService>();
    _media.url.mockReturnValue("/path/to/media.png");
  });

  afterEach(() => ZCircusDestroy.sequential(_driver, _renderer));

  function createSystemMemoryHistory(system: string) {
    return createMemoryHistory({ initialEntries: [`/systems/${system}`] });
  }

  async function createTestTarget(props: ZRomulatorSystemPageProps = {}) {
    const { history = createSystemMemoryHistory(nes.id) } = props;

    const element = (
      <ZRomulatorMediaServiceContext value={_media}>
        <ZRomulatorSystemsServiceContext value={_systems}>
          <ZRomulatorGamesServiceContext value={_games}>
            <ZTestRouter navigator={history} location={history.location}>
              <ZRouteMap>
                <ZRoute
                  path="/systems/:id"
                  element={<ZRomulatorSystemPage />}
                />
                <ZRoute path="*" element={<ZNotFound />} />
              </ZRouteMap>
            </ZTestRouter>
          </ZRomulatorGamesServiceContext>
        </ZRomulatorSystemsServiceContext>
      </ZRomulatorMediaServiceContext>
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

  describe("Information", () => {
    async function shouldRenderInformation(
      expected: string,
      fieldFn: (target: ZRomulatorSystemPageComponentModel) => Promise<string>,
    ) {
      // Arrange.
      const target = await createTestTarget();
      await target.load();

      // Act.
      const actual = await fieldFn(target);

      // Assert.
      expect(actual).toEqual(expected);
    }

    it("should render the system name", async () => {
      await shouldRenderInformation(nes.name, (t) => t.name());
    });

    it("should render the system company", async () => {
      await shouldRenderInformation(nes.company, (t) => t.company());
    });

    it("should render the system hardware type", async () => {
      const { classification } = nes;
      const { hardwareType } = classification;

      await shouldRenderInformation(hardwareType, (t) => t.hardwareType());
    });

    it("should render the system media format", async () => {
      const { classification } = nes;
      const { mediaFormat } = classification;

      await shouldRenderInformation(mediaFormat, (t) => t.mediaFormat());
    });

    it("should render the content type", async () => {
      const { classification } = nes;
      const { contentType } = classification;

      await shouldRenderInformation(contentType, (t) => t.contentType());
    });

    it("should render the production start date", async () => {
      const { productionYears } = nes;
      const { start } = productionYears;

      await shouldRenderInformation(String(start), (t) => t.productionStart());
    });

    it("should render the production end date", async () => {
      const { productionYears } = nes;
      const { end } = productionYears;

      await shouldRenderInformation(String(end), (t) => t.productionEnd());
    });
  });

  describe("Games", () => {
    it("should only load games that are assigned to the given system", async () => {
      // Arrange.
      const target = await createTestTarget();
      await target.load();
      const games = await target.games();
      await (await games?.suspense())?.load();

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
      await (await games?.suspense())?.load();

      // Act.
      const _batman = await target.game(batman.id);
      await _batman?.click();

      // Assert.
      expect(history.location.pathname).toEqual(`/games/${batman.id}`);
    });
  });

  describe("Media", () => {
    it("should render the controller", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const image = await target.controller();
      const identifier = await image.identifier();
      const actual = await image.type();

      // Assert.
      expect(identifier).toEqual(nes.id);
      expect(actual).toEqual(ZRomulatorSystemMediaType.Controller);
    });

    it("should render the picture", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const image = await target.picture();
      const identifier = await image.identifier();
      const actual = await image.type();

      // Assert.
      expect(identifier).toEqual(nes.id);
      expect(actual).toEqual(ZRomulatorSystemMediaType.Picture);
    });

    it("should render the wheel", async () => {
      // Arrange.
      const target = await createTestTarget();

      // Act.
      const image = await target.wheel();
      const identifier = await image.identifier();
      const actual = await image.type();

      // Assert.
      expect(identifier).toEqual(nes.id);
      expect(actual).toEqual(ZRomulatorSystemMediaType.Wheel);
    });
  });
});
