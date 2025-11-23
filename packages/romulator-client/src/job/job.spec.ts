import { describe, expect, it } from "vitest";
import { ZJobType } from "./job-type.mjs";
import { ZJobBuilder } from "./job.mjs";

describe("ZJobBuilder", () => {
  const createTestTarget = () => new ZJobBuilder<Record<string, string>>();

  describe("Id", () => {
    it("should set the id", () => {
      const id = "job-id";
      expect(createTestTarget().id(id).build().id).toEqual(id);
    });
  });

  describe("Type", () => {
    it("should set the job type", () => {
      const type = ZJobType.Scrape;
      expect(createTestTarget().type(type).build().type).toEqual(type);
    });
  });

  describe("Context", () => {
    it("should set the context", () => {
      const context = { answer: "42" };
      expect(createTestTarget().context(context).build().context).toEqual(
        context,
      );
    });
  });

  describe("Copy", () => {
    it("should clone another job", () => {
      // Arrange.
      const expected = createTestTarget()
        .id("job-id")
        .type(ZJobType.Scrape)
        .context({ question: "life" })
        .build();
      const target = createTestTarget();

      // Act.
      const actual = target.copy(expected).build();

      // Assert.
      expect(actual).toEqual(expected);
      expect(actual).not.toBe(expected);
    });
  });
});
