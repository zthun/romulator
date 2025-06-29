import { describe, expect, it } from "vitest";
import { isSystemId, ZRomulatorSystemId } from "./system-id.mjs";

describe("IsSystemId", () => {
  it("should return true for supported systems", () => {
    expect(isSystemId(ZRomulatorSystemId.Switch)).toBeTruthy();
  });

  it("should return false for unsupported systems", () => {
    expect(isSystemId("ps105")).toBeFalsy();
  });

  it("should return false for non strings", () => {
    expect(isSystemId(42)).toBeFalsy();
  });

  it("should return false for undefined", () => {
    expect(isSystemId(undefined)).toBeFalsy();
  });

  it("should return false for null", () => {
    expect(isSystemId(null)).toBeFalsy();
  });
});
