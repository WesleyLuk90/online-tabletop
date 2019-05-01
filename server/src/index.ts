import express, { Request, Response } from "express";
import { initializeAuth } from "./auth";
import { createDatabase } from "./database";
import { UserFacingError } from "./errors";
import { initializeGames } from "./games/games";
import { RequestData } from "./route";
import { initializeSession } from "./session";

function getUserId(req: Request): string | null {
    if (!req.session.passport || !req.session.passport.user) {
        return null;
    }
    return req.session.passport.user;
}

function getRequestData(req: Request): RequestData<{}, {}> {
    return {
        body: req.body || {},
        query: req.query || {}
    };
}

async function main() {
    require("dotenv").config();
    const app = express();
    const port = 3001;

    const db = await createDatabase();

    await initializeSession(app);
    await initializeAuth(app);
    const routes = await initializeGames(db);
    Object.keys(routes).forEach(path => {
        const route = routes[path];
        (app as any)[route.method](
            path,
            async (req: Request, res: Response) => {
                try {
                    const id = getUserId(req);
                    if (id == null) {
                        return res.sendStatus(401);
                    }
                    const response = await route.handle({
                        user_id: id,
                        data: getRequestData(req)
                    });
                    res.json(response);
                } catch (e) {
                    if (e instanceof UserFacingError) {
                        res.status(e.code()).send(e.message);
                    } else {
                        console.error(e);
                        res.sendStatus(500);
                    }
                }
            }
        );
    });

    app.get("/", (req, res) =>
        res.send("Hello World!" + JSON.stringify(req.session))
    );

    app.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
    );
}

main().catch(e => {
    console.error(e);
    process.exit(-1);
});
