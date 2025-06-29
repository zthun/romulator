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
import {
  ZRomulatorSystemBuilder,
  ZRomulatorSystemId,
} from "@zthun/romulator-client";
import type { History } from "history";
import { createMemoryHistory } from "history";
import { noop } from "lodash-es";
import type { Mocked } from "vitest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mock } from "vitest-mock-extended";
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
    .build();

  let _driver: IZCircusDriver;
  let _renderer: IZCircusSetup;
  let _systems: Mocked<IZRomulatorSystemsService>;

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
  });

  afterEach(async () => {
    await _driver?.destroy?.call(_driver);
    await _renderer?.destroy?.call(_renderer);
  });

  async function createTestTarget(props: ZRomulatorSystemPageProps = {}) {
    const {
      history = createMemoryHistory({ initialEntries: [`/systems/${nes.id}`] }),
    } = props;

    const element = (
      <ZRomulatorSystemsServiceContext value={_systems}>
        <ZTestRouter navigator={history} location={history.location}>
          <ZRouteMap>
            <ZRoute path="/systems/:id" element={<ZRomulatorSystemPage />} />
            <ZRoute path="*" element={<ZNotFound />} />
          </ZRouteMap>
        </ZTestRouter>
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
      const history = createMemoryHistory({
        initialEntries: ["/systems/does-not-exist"],
      });
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
      const system = await target.system();
      const actual = await system?.id();

      // Assert.
      expect(actual).toEqual(nes.id);
    });
  });
});
