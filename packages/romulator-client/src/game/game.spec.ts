import { describe, expect, it } from "vitest";
import { ZRomulatorPlayersBuilder } from "../players/players.mjs";
import { ZRomulatorSystemId } from "../system/system-id.mjs";
import { ZRomulatorGameBuilder } from "./game.mjs";

describe("Game", () => {
  const createTestTarget = () => new ZRomulatorGameBuilder();

  describe("Id", () => {
    it("should set the id", () => {
      const expected = "nes-super-mario-bros";
      expect(createTestTarget().id(expected).build().id).toEqual(expected);
    });
  });

  describe("Name", () => {
    it("should set the name", () => {
      const expected = "Super Mario Bros.";
      expect(createTestTarget().name(expected).build().name).toEqual(expected);
    });
  });

  describe("File", () => {
    it("should set the file path", () => {
      const expected = "/roms/nes/super-mario-bros.zip";
      expect(createTestTarget().file(expected).build().file).toEqual(expected);
    });
  });

  describe("System", () => {
    it("should set the system id", () => {
      const expected = ZRomulatorSystemId.Nintendo;
      expect(createTestTarget().system(expected).build().system).toEqual(
        expected,
      );
    });
  });

  describe("Copy", () => {
    const mario = createTestTarget()
      .id("nes-super-mario-bros")
      .name("Super Mario Bros")
      .file("/roms/nes/super-mario-bros.zip")
      .publisher("Nintendo")
      .developer("Nintendo")
      .build();

    it("should copy the values from another game", () => {
      expect(createTestTarget().copy(mario).build()).toEqual(mario);
    });
  });

  describe("Parse", () => {
    it("should return the same state if the candidate is null", () => {
      const expected = createTestTarget().build();

      expect(createTestTarget().parse(null).build()).toEqual(expected);
    });

    it("should return the same state if the candidate is undefined", () => {
      const expected = createTestTarget().build();

      expect(createTestTarget().parse(undefined).build()).toEqual(expected);
    });

    it("should return the same state if the candidate is not an object", () => {
      const expected = createTestTarget().build();

      expect(createTestTarget().parse("not-a-candidate").build()).toEqual(
        expected,
      );
    });

    describe("Name", () => {
      it("should set the name if there is a string name on the candidate", () => {
        const name = "Batman The Video Game";

        expect(createTestTarget().parse({ name }).build().name).toEqual(name);
      });

      it("should keep the name if the name is not a string", () => {
        const name = 42;
        const expected = "Original";

        expect(
          createTestTarget().name(expected).parse({ name }).build().name,
        ).toEqual(expected);
      });

      it("should keep the name if the name does not exist", () => {
        const expected = "Original";

        expect(
          createTestTarget().name(expected).parse({}).build().name,
        ).toEqual(expected);
      });
    });

    describe("Description", () => {
      it("should set the value if there is a string name on the candidate", () => {
        const description = "Go fight the joker";

        expect(
          createTestTarget().parse({ description }).build().description,
        ).toEqual(description);
      });

      it("should keep the value if the description is not a string", () => {
        const description = 42;
        const expected = "Original";

        expect(
          createTestTarget()
            .description(expected)
            .parse({ description })
            .build().description,
        ).toEqual(expected);
      });

      it("should keep the value if the description does not exist", () => {
        const expected = "Original";

        expect(
          createTestTarget().description(expected).parse({}).build()
            .description,
        ).toEqual(expected);
      });
    });

    describe("Description", () => {
      it("should set the value if there is a string name on the candidate", () => {
        const description = "Go fight the joker";

        expect(
          createTestTarget().parse({ description }).build().description,
        ).toEqual(description);
      });

      it("should keep the value if the description is not a string", () => {
        const description = 42;
        const expected = "Original";

        expect(
          createTestTarget()
            .description(expected)
            .parse({ description })
            .build().description,
        ).toEqual(expected);
      });

      it("should keep the value if the description does not exist", () => {
        const expected = "Original";

        expect(
          createTestTarget().description(expected).parse({}).build()
            .description,
        ).toEqual(expected);
      });
    });

    describe("Players", () => {
      it("should set the value", () => {
        const players = new ZRomulatorPlayersBuilder().twoPlayer().build();
        expect(createTestTarget().parse({ players }).build().players).toEqual(
          players,
        );
      });

      it("should keep the value if players is not an object", () => {
        const players = new ZRomulatorPlayersBuilder().fourPlayer().build();
        expect(
          createTestTarget().players(players).parse({ players: 42 }).build()
            .players,
        ).toEqual(players);
      });
    });

    describe("Release Date", () => {
      it("should set the value", () => {
        const release = "2021-10-14";
        expect(createTestTarget().parse({ release }).build().release).toEqual(
          release,
        );
      });

      it("should keep the value if release is not a string", () => {
        const expected = "1986-08-12";
        const release = 42;

        expect(
          createTestTarget().release(expected).parse({ release }).build()
            .release,
        ).toEqual(expected);
      });
    });

    describe("Developer", () => {
      it("should set the value", () => {
        const developer = "Sega";

        expect(
          createTestTarget().parse({ developer }).build().developer,
        ).toEqual(developer);
      });

      it("should keep the value if developer is not a string", () => {
        const expected = "Original";
        const developer = 42;

        expect(
          createTestTarget().developer(expected).parse({ developer }).build()
            .developer,
        ).toEqual(expected);
      });

      it("should keep the value if developer is not set", () => {
        const expected = "Square";

        expect(
          createTestTarget().developer(expected).parse({}).build().developer,
        ).toEqual(expected);
      });
    });

    describe("Publisher", () => {
      it("should set the value", () => {
        const publisher = "Enix";

        expect(
          createTestTarget().parse({ publisher }).build().publisher,
        ).toEqual(publisher);
      });

      it("should keep the value if publisher is not a string", () => {
        const expected = "Original";
        const publisher = 42;

        expect(
          createTestTarget().publisher(expected).parse({ publisher }).build()
            .publisher,
        ).toEqual(expected);
      });

      it("should keep the value if publisher is not set", () => {
        const expected = "Square";

        expect(
          createTestTarget().publisher(expected).parse({}).build().publisher,
        ).toEqual(expected);
      });
    });
  });
});
