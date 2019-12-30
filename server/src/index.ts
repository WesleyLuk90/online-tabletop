import express from "express";
import { Server } from "http";
import { initializeAuth } from "./Auth";
import { ConfigKeys, readConfig, readConfigNumber } from "./Config";
import { BroadcastService } from "./game/BroadcastService";
import { CampaignManager } from "./game/CampaignManager";
import { CampaignStorage } from "./game/CampaignStorage";
import { NotificationService } from "./game/NotificationService";
import { connectRoutes } from "./Requests";
import { initializeSession } from "./Session";
import { DatabaseProvider } from "./storage/DatabaseProvider";

async function main() {
    require("dotenv").config();
    const app = express();
    const http = new Server(app);

    app.use(express.json());
    const port = readConfigNumber(ConfigKeys.HTTP_PORT);

    const dbProvider = new DatabaseProvider(
        readConfig(ConfigKeys.MONGO_HOST),
        readConfig(ConfigKeys.MONGO_DATABASE)
    );

    await initializeSession(readConfig(ConfigKeys.SESSION_SECRET), app);
    await initializeAuth(
        {
            clientID: readConfig(ConfigKeys.AUTH0_CLIENT_ID),
            clientSecret: readConfig(ConfigKeys.AUTH0_CLIENT_SECRET),
            callbackURL: readConfig(ConfigKeys.AUTH0_CALLBACK_URL),
            domain: readConfig(ConfigKeys.AUTH0_DOMAIN)
        },
        app
    );

    const broadcastService = new BroadcastService(http);
    const notificationService = new NotificationService(broadcastService);
    const campaignStorage = new CampaignStorage(dbProvider);
    const campaignManager = new CampaignManager(
        campaignStorage,
        notificationService
    );
    connectRoutes(campaignManager.routes(), app);

    http.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
    );
}

main().catch(e => {
    console.error(e);
    process.exit(-1);
});
