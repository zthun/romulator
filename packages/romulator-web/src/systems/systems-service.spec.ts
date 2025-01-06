import { IZCircusSetup } from "@zthun/cirque";
import { IZCircusReactHook, ZCircusSetupHook } from "@zthun/cirque-du-react";
import { ZDataRequestBuilder, ZPageBuilder } from "@zthun/helpful-query";
import { IZRomulatorSystem, ZRomulatorSystemBuilder } from "@zthun/romulator";
import {
  ZHttpMethod,
  ZHttpResultBuilder,
  ZHttpServiceMock,
} from "@zthun/webigail-http";
import { ZRestfulUrlBuilder } from "@zthun/webigail-rest";
import { ZUrlBuilder } from "@zthun/webigail-url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  IZRomulatorSystemsService,
  useSystemsService,
  ZRomulatorSystemsService,
} from "./systems-service.mjs";

describe("SystemsService", () => {
  let _http: ZHttpServiceMock;

  const nes = new ZRomulatorSystemBuilder().nes().build();
  const snes = new ZRomulatorSystemBuilder().snes().build();
  const systems = [nes, snes];

  beforeEach(async () => {
    _http = new ZHttpServiceMock();
  });

  const createTestTarget = () => new ZRomulatorSystemsService(_http);

  describe("Read", () => {
    it("should retrieve a list of systems", async () => {
      // Arrange.
      const target = createTestTarget();
      const request = new ZDataRequestBuilder().build();

      _http.set(
        target.endpoint(),
        ZHttpMethod.Get,
        new ZHttpResultBuilder(
          new ZPageBuilder<IZRomulatorSystem>().all(systems).build(),
        ).build(),
      );

      // Act.
      const actual = await target.retrieve(request);

      // Assert.
      expect(actual).toEqual(systems);
    });

    it("should retrieve a single system by id", async () => {
      // Arrange.
      const target = createTestTarget();

      _http.set(
        new ZUrlBuilder().parse(target.endpoint()).append(nes.id).build(),
        ZHttpMethod.Get,
        new ZHttpResultBuilder(nes).build(),
      );

      _http.set(
        new ZUrlBuilder().parse(target.endpoint()).append(snes.id).build(),
        ZHttpMethod.Get,
        new ZHttpResultBuilder(snes).build(),
      );

      // Act.
      const _nes = await target.get(nes.id);
      const _snes = await target.get(snes.id);

      // Assert.
      expect(_nes).toEqual(nes);
      expect(_snes).toEqual(snes);
    });
  });

  describe("Count", () => {
    it("should count the number of systems", async () => {
      // Arrange.
      const target = createTestTarget();

      _http.set(
        new ZRestfulUrlBuilder(target.endpoint()).count().build(),
        ZHttpMethod.Get,
        new ZHttpResultBuilder(
          new ZPageBuilder<IZRomulatorSystem>()
            .data([nes])
            .count(systems.length)
            .build(),
        ).build(),
      );

      // Act.
      const actual = await target.count(new ZDataRequestBuilder().build());

      // Assert.
      expect(actual).toEqual(systems.length);
    });
  });
});

describe("useSystemsService", () => {
  let _hook: IZCircusSetup<
    IZCircusReactHook<IZRomulatorSystemsService, unknown>
  >;

  const createTestTarget = () => {
    _hook = new ZCircusSetupHook(() => useSystemsService());

    return _hook?.setup();
  };

  afterEach(async () => {
    await _hook?.destroy?.call(_hook);
  });

  it("should have a default implementation", async () => {
    // Arrange.
    const target = await createTestTarget();

    // Act.
    const actual = await target.current();

    // Assert.
    expect(actual).toBeInstanceOf(ZRomulatorSystemsService);
  });
});
