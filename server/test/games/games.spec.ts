import { Sequelize } from "sequelize";
import { NotFoundError } from "../../src/errors";
import { initializeGames } from "../../src/games/games";
import { createContext } from "../RequestDataToolkit";

describe("games", () => {
    it("should create", async () => {
        const db = new Sequelize("sqlite://:memory:", { logging: () => {} });
        const routes = await initializeGames(db);

        const { game: createdGame } = await routes["/api/games/create"].handle(
            createContext("user1", { body: { name: "my game" } })
        );
        expect(createdGame.name).toEqual("my game");
        expect(createdGame.id).toBeGreaterThan(0);

        const list = await routes["/api/games"].handle(createContext("user1"));
        expect(list.games).toContainEqual(createdGame);

        const found = await routes["/api/games/get"].handle(
            createContext("user1", { query: { id: createdGame.id.toString() } })
        );
        expect(found.game).toEqual(createdGame);
    });

    it("should return games with permission", async () => {
        const db = new Sequelize("sqlite://:memory:", { logging: () => {} });
        const routes = await initializeGames(db);

        const { game: createdGame } = await routes["/api/games/create"].handle(
            createContext("user1", { body: { name: "my game" } })
        );

        const list = await routes["/api/games"].handle(createContext("user2"));
        expect(list.games).toHaveLength(0);

        await expect(
            routes["/api/games/get"].handle(
                createContext("user2", {
                    query: {
                        id: createdGame.id.toString()
                    }
                })
            )
        ).rejects.toThrowError(NotFoundError);
    });
});
