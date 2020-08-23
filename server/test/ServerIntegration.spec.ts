import { Api, E, iots, pipe } from "engine";
import { Implementation } from "../src/api/Implementation";
import { AppModule } from "../src/AppModule";
import { lazy } from "../src/Module";
import { AppClient } from "./AppClient";
import { generateConfig } from "./TestConfig";

describe("ServerIntegration", () => {
    it("should respond", async () => {
        const app = new AppModule(generateConfig());
        const client = AppClient.fromModule(app);
        app.api = lazy(() => [
            new Implementation(
                new Api(
                    "foo",
                    iots.strict({ foo: iots.string }),
                    iots.strict({ bar: iots.string })
                ),
                async (ctx, input) => ({ bar: input.foo })
            ),
        ]);
        await app.routeApi();
        await app.startServer();
        try {
            expect(
                pipe(
                    await client.sendRequestE({
                        path: `/api/404`,
                    }),
                    E.fold(
                        (e) => e,
                        (r) => {
                            throw r;
                        }
                    ),
                    (e) => e.response?.status
                )
            ).toEqual(404);
            expect(
                pipe(
                    await client.sendRequestE({
                        path: `/api/foo`,
                        body: { bad: "request" },
                    }),
                    E.fold(
                        (e) => e,
                        (r) => {
                            throw r;
                        }
                    ),
                    (e) => e.response?.status
                )
            ).toEqual(400);
            expect(
                (
                    await client.sendRequest({
                        path: `/api/foo`,
                        body: { foo: "fooz" },
                    })
                ).data
            ).toEqual({ bar: "fooz" });
        } finally {
            await app.stopServer();
        }
    });
});
