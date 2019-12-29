import express from "express";
import { Server } from "http";
import { initializeAuth } from "./Auth";
import { ConfigKeys, readConfig } from "./Config";
import { BroadcastService } from "./game/BroadcastService";
import { NotificationService } from "./game/NotificationService";
import { initializeSession } from "./Session";
import { DatabaseProvider } from "./storage/DatabaseProvider";

async function main() {
    require("dotenv").config();
    const app = express();
    const http = new Server(app);

    app.use(express.json());
    const port = 3001;

    const dbProvider = new DatabaseProvider(
        readConfig(ConfigKeys.MONGO_HOST),
        readConfig(ConfigKeys.MONGO_DATABASE)
    );

    await initializeSession(readConfig(ConfigKeys.SESSION_SECRET), app);
    await initializeAuth(
        readConfig(ConfigKeys.GOOGLE_CLIENT_ID),
        readConfig(ConfigKeys.GOOGLE_CLIENT_SECRET),
        readConfig(ConfigKeys.GOOGLE_CALLBACK_URL),
        app
    );

    const broadcastService = new BroadcastService(http);
    const notificationService = new NotificationService(broadcastService);
    // const gamesService = await GameService.create(db);
    // connectRoutes(gameRoutes(gamesService), app);
    // connectRoutes(await initializePlay(http, gamesService, db), app);

    http.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
    );
}

main().catch(e => {
    console.error(e);
    process.exit(-1);
});
