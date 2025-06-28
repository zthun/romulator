import { describe, expect, it } from "vitest";
import { ZRomulatorSystemKnown } from "./system-known.mjs";

describe("System Known", () => {
  it("should return all systems", () => {
    expect(ZRomulatorSystemKnown.all().length).toBeGreaterThan(0);
  });
});
