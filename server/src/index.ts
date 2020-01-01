import express from "express";
import { Server } from "http";
import { initializeAuth } from "./auth/Auth";
import { UserManager } from "./auth/UserManager";
import { UserStorage } from "./auth/UserStorage";
import { ConfigKeys, readConfig, readConfigNumber } from "./Config";
import { BroadcastService } from "./game/BroadcastService";
import { CampaignManager } from "./game/CampaignManager";
import { CampaignPermissionService } from "./game/CampaignPermissionService";
import { CampaignStorage } from "./game/CampaignStorage";
import { NotificationService } from "./game/NotificationService";
import { SceneManager } from "./game/SceneManager";
import { SceneStorage } from "./game/SceneStorage";
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

    const userStorage = new UserStorage(dbProvider);
    const userManager = new UserManager(userStorage);

    await initializeSession(readConfig(ConfigKeys.SESSION_SECRET), app);
    await initializeAuth(
        {
            clientID: readConfig(ConfigKeys.AUTH0_CLIENT_ID),
            clientSecret: readConfig(ConfigKeys.AUTH0_CLIENT_SECRET),
            callbackURL: readConfig(ConfigKeys.AUTH0_CALLBACK_URL),
            domain: readConfig(ConfigKeys.AUTH0_DOMAIN)
        },
        app,
        userStorage
    );

    const broadcastService = new BroadcastService(http);
    const notificationService = new NotificationService(broadcastService);
    const campaignStorage = new CampaignStorage(dbProvider);
    const campaignManager = new CampaignManager(
        campaignStorage,
        notificationService
    );
    const sceneStorage = new SceneStorage(dbProvider);
    const permissionService = new CampaignPermissionService(campaignStorage);
    const sceneManager = new SceneManager(sceneStorage, permissionService);

    connectRoutes(userManager.routes(), app);
    connectRoutes(campaignManager.routes(), app);
    connectRoutes(sceneManager.routes(), app);

    http.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
    );
}

main().catch(e => {
    console.error(e);
    process.exit(-1);
});
