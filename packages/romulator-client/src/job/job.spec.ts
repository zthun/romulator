import { createGuid } from "@zthun/helpful-fn";
import { describe, expect, it } from "vitest";
import { ZJobStatus } from "./job-status.mjs";
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

  describe("State", () => {
    describe("Idle", () => {
      it("should set the status", () => {
        expect(createTestTarget().idle().build().status).toEqual(
          ZJobStatus.Idle,
        );
      });
    });

    describe("Running", () => {
      it("should set the status", () => {
        expect(createTestTarget().running().build().status).toEqual(
          ZJobStatus.Running,
        );
      });
    });

    describe("Canceled", () => {
      it("should set the status", () => {
        expect(createTestTarget().canceled().build().status).toEqual(
          ZJobStatus.Canceled,
        );
      });
    });

    describe("Failed", () => {
      it("should set the status", () => {
        expect(createTestTarget().failed().build().status).toEqual(
          ZJobStatus.Failed,
        );
      });
    });

    describe("Success", () => {
      it("should set the status", () => {
        expect(createTestTarget().success().build().status).toEqual(
          ZJobStatus.Success,
        );
      });
    });
  });

  describe("Percent", () => {
    it("should set the percentage to 0 on start", () => {
      expect(createTestTarget().start().build().percent).toEqual(0);
    });

    it("should set the percentage to 100 on completion", () => {
      expect(createTestTarget().complete().build().percent).toEqual(100);
    });

    it("should remove the percentage", () => {
      expect(createTestTarget().percent().build().percent).toBeUndefined();
    });

    it("should round the percentage up a half", () => {
      expect(createTestTarget().percent(4.5).build().percent).toEqual(5);
    });

    it("should round the percentage down under half", () => {
      expect(createTestTarget().percent(4.49).build().percent).toEqual(4);
    });

    it("should maximize the percent at 100", () => {
      expect(createTestTarget().percent(101).build().percent).toEqual(100);
    });

    it("should minimize the percent at 0", () => {
      expect(createTestTarget().percent(-1).build().percent).toEqual(0);
    });
  });

  describe("Redact", () => {
    it("should remove the createdAt field", () => {
      expect(
        createTestTarget().createdAt(new Date().toJSON()).redact().build()
          .createdAt,
      ).toBeUndefined();
    });

    it("should remove the id", () => {
      expect(createTestTarget().guid().redact().build().id).toBeUndefined();
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
