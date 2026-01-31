import { createGuid } from "@zthun/helpful-fn";
import { describe, expect, it } from "vitest";
import { ZJobType } from "./job-type.mjs";
import { ZJobBuilder } from "./job.mjs";

describe("ZJobBuilder", () => {
  const createTestTarget = () => new ZJobBuilder();

  describe("Id", () => {
    it("should set the id", () => {
      const id = "job-id";
      expect(createTestTarget().id(id).build().id).toEqual(id);
    });

    it("should generate the id", () => {
      expect(createTestTarget().guid().build().id).toBeTruthy();
    });

    it("should keep the id if one was already generated or set", () => {
      const expected = createGuid();
      expect(createTestTarget().id(expected).guid().build().id).toEqual(
        expected,
      );
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

  describe("Created", () => {
    it("should set the created date", () => {
      const expected = new Date().toJSON();
      expect(createTestTarget().createdAt(expected).build().createdAt).toEqual(
        expected,
      );
    });
  });

  describe("Redact", () => {
    it("should remove the createdAt field", () => {
      expect(
        createTestTarget().createdAt(new Date().toJSON()).redact().build()
          .createdAt,
      ).toBeUndefined();
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
