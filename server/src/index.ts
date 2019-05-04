import express from "express";
import { Server } from "http";
import { initializeAuth } from "./auth";
import { createDatabase } from "./database";
import { initializeGames } from "./games/games";
import { initializePlay } from "./play";
import { connectRoutes } from "./requests";
import { initializeSession } from "./session";

async function main() {
    require("dotenv").config();
    const app = express();
    const http = new Server(app);

    app.use(express.json());
    const port = 3001;

    const db = await createDatabase();

    await initializeSession(app);
    await initializeAuth(app);
    const routes = await initializeGames(db);
    connectRoutes(routes, app);
    initializePlay(http);

    http.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
    );
}

main().catch(e => {
    console.error(e);
    process.exit(-1);
});
