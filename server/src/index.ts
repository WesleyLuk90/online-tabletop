import express, { Request, Response } from "express";
import { initializeAuth } from "./auth";
import { createDatabase } from "./database";
import { initializeGames } from "./games/games";
import { RequestData } from "./route";
import { initializeSession } from "./session";

function getUserId(req: Request): string | null {
    if (!req.session.passport || !req.session.passport.user) {
        return null;
    }
    return req.session.passport.user;
}

function getRequestData(req: Request): RequestData<{}> {
    return {
        body: req.body
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
    routes.forEach(r => {
        (app as any)[r.method](r.path, async (req: Request, res: Response) => {
            try {
                const id = getUserId(req);
                if (id == null) {
                    return res.sendStatus(401);
                }
                const response = await r.handle(getRequestData(req), {
                    user_id: id
                });
                res.json(response);
            } catch (e) {
                console.error(e);
                res.sendStatus(500);
            }
        });
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
