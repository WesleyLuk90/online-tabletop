import { Sequelize } from "sequelize";
import { initializeGames } from "../../src/games/games";

describe("games", () => {
    it("should create", async () => {
        const db = new Sequelize("sqlite://:memory:", { logging: () => {} });
        const routes = await initializeGames(db);

        const route = routes.find(r => r.path === "/api/games/create");
        const created = await route.handle(
            {
                body: {
                    name: "my game"
                },
                query: {}
            },
            {
                user_id: "user1"
            }
        );
        expect(created.name).toEqual("my game");
        expect(created.id).toBeGreaterThan(0);

        const list = await routes
            .find(r => r.path === "/api/games")
            .handle(
                { body: {}, query: {} },
                {
                    user_id: "user1"
                }
            );
        expect(list).toContain(created);

        const found = await routes
            .find(r => r.path === "/api/games/get")
            .handle(
                {
                    body: {},
                    query: { id: created.id.toString() }
                },
                {
                    user_id: "user1"
                }
            );
        expect(found).toEqual(created);
    });
});
