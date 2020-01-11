import express from "express";
import { Server } from "http";
import { resolve } from "path";
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
import { lazy, Module } from "./Module";
import { connectRoutes } from "./Requests";
import { initializeSession } from "./Session";
import { DatabaseProvider } from "./storage/DatabaseProvider";

export class AppModule extends Module {
    app = lazy(() => express());
    http = lazy(() => new Server(this.app()));
    staticPath = lazy(() => resolve(process.cwd(), "../client/build"));
    port = lazy(() => readConfigNumber(ConfigKeys.HTTP_PORT));

    dbProvider = lazy(
        () =>
            new DatabaseProvider(
                readConfig(ConfigKeys.MONGO_HOST),
                readConfig(ConfigKeys.MONGO_DATABASE)
            )
    );

    userStorage = lazy(() => new UserStorage(this.dbProvider()));
    userManager = lazy(() => new UserManager(this.userStorage()));

    broadcastService = lazy(() => new BroadcastService(this.http()));
    notificationService = lazy(
        () => new NotificationService(this.broadcastService())
    );
    campaignStorage = lazy(() => new CampaignStorage(this.dbProvider()));
    campaignManager = lazy(
        () =>
            new CampaignManager(
                this.campaignStorage(),
                this.notificationService()
            )
    );
    sceneStorage = lazy(() => new SceneStorage(this.dbProvider()));
    permissionService = lazy(
        () => new CampaignPermissionService(this.campaignStorage())
    );
    sceneManager = lazy(
        () =>
            new SceneManager(
                this.sceneStorage(),
                this.permissionService(),
                this.notificationService()
            )
    );

    async start() {
        require("dotenv").config();
        console.log(`Serving static files from ${this.staticPath()}`);
        this.app().use(express.static(this.staticPath()));
        this.app().use(express.json());

        connectRoutes(this.userManager().routes(), this.app());
        connectRoutes(this.campaignManager().routes(), this.app());
        connectRoutes(this.sceneManager().routes(), this.app());

        await initializeSession(
            readConfig(ConfigKeys.SESSION_SECRET),
            this.app()
        );
        await initializeAuth(
            {
                clientID: readConfig(ConfigKeys.AUTH0_CLIENT_ID),
                clientSecret: readConfig(ConfigKeys.AUTH0_CLIENT_SECRET),
                callbackURL: readConfig(ConfigKeys.AUTH0_CALLBACK_URL),
                domain: readConfig(ConfigKeys.AUTH0_DOMAIN)
            },
            this.app(),
            this.userStorage()
        );

        this.http().listen(this.port(), () =>
            console.log(`Example app listening on port ${this.port()}!`)
        );
    }
}
