import express from "express";
import { Server } from "http";
import { initializeAuth } from "./auth";
import { createDatabase } from "./database";
import { gameRoutes } from "./games/GameRoutes";
import { GameService } from "./games/GameService";
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
    const gamesService = await GameService.create(db);
    connectRoutes(gameRoutes(gamesService), app);
    connectRoutes(await initializePlay(http, gamesService), app);

    http.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
    );
}

main().catch(e => {
    console.error(e);
    process.exit(-1);
});
