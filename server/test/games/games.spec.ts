import { Sequelize } from "sequelize";
import { NotFoundError } from "../../src/errors";
import { initializeGames } from "../../src/games/games";
import { withBody, withQuery } from "../RequestDataToolkit";

describe("games", () => {
    it("should create", async () => {
        const db = new Sequelize("sqlite://:memory:", { logging: () => {} });
        const routes = await initializeGames(db);

        const route = routes.find(r => r.path === "/api/games/create");
        const { game: createdGame } = await route.handle(
            withBody({ name: "my game" }),
            {
                user_id: "user1"
            }
        );
        expect(createdGame.name).toEqual("my game");
        expect(createdGame.id).toBeGreaterThan(0);

        const list = await routes
            .find(r => r.path === "/api/games")
            .handle(withBody({}), {
                user_id: "user1"
            });
        expect(list.games).toContainEqual(createdGame);

        const found = await routes
            .find(r => r.path === "/api/games/get")
            .handle(withQuery({ id: createdGame.id.toString() }), {
                user_id: "user1"
            });
        expect(found.game).toEqual(createdGame);
    });

    it("should return games with permission", async () => {
        const db = new Sequelize("sqlite://:memory:", { logging: () => {} });
        const routes = await initializeGames(db);

        const route = routes.find(r => r.path === "/api/games/create");
        const { game: createdGame } = await route.handle(
            withBody({ name: "my game" }),
            {
                user_id: "user1"
            }
        );

        const list = await routes
            .find(r => r.path === "/api/games")
            .handle(withBody({}), {
                user_id: "user2"
            });
        expect(list.games).toHaveLength(0);

        await expect(
            routes
                .find(r => r.path === "/api/games/get")
                .handle(withQuery({ id: createdGame.id.toString() }), {
                    user_id: "user2"
                })
        ).rejects.toThrowError(NotFoundError);
    });
});
