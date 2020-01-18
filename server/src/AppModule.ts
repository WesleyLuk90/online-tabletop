import express from "express";
import { Server } from "http";
import { resolve } from "path";
import { initializeAuth } from "./auth/Auth";
import { UserManager } from "./auth/UserManager";
import { UserCollection, UserStorage } from "./auth/UserStorage";
import { ConfigKeys, readConfig, readConfigNumber } from "./Config";
import { BroadcastService } from "./game/BroadcastService";
import { CampaignManager } from "./game/CampaignManager";
import { CampaignPermissionService } from "./game/CampaignPermissionService";
import { CampaignCollection, CampaignStorage } from "./game/CampaignStorage";
import { NotificationService } from "./game/NotificationService";
import { SceneManager } from "./game/SceneManager";
import { SceneCollection, SceneStorage } from "./game/SceneStorage";
import { TokenManager } from "./game/TokenManager";
import { TokenProcessor } from "./game/TokenProcessor";
import { TokenCollection, TokenStorage } from "./game/TokenStorage";
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

    userCollection = lazy(() => new UserCollection(this.dbProvider()));
    userStorage = lazy(() => new UserStorage(this.userCollection()));
    userManager = lazy(() => new UserManager(this.userStorage()));

    broadcastService = lazy(() => new BroadcastService(this.http()));
    notificationService = lazy(
        () => new NotificationService(this.broadcastService())
    );
    campaignCollection = lazy(() => new CampaignCollection(this.dbProvider()));
    campaignStorage = lazy(
        () => new CampaignStorage(this.campaignCollection())
    );
    campaignManager = lazy(
        () =>
            new CampaignManager(
                this.campaignStorage(),
                this.notificationService()
            )
    );
    sceneCollection = lazy(() => new SceneCollection(this.dbProvider()));
    sceneStorage = lazy(() => new SceneStorage(this.sceneCollection()));
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

    tokenCollection = lazy(() => new TokenCollection(this.dbProvider()));
    tokenStorage = lazy(() => new TokenStorage(this.tokenCollection()));

    tokenProcessor = lazy(
        () =>
            new TokenProcessor(this.tokenStorage(), this.notificationService())
    );

    tokenManager = lazy(
        () =>
            new TokenManager(
                this.tokenProcessor(),
                this.permissionService(),
                this.tokenStorage()
            )
    );

    collections = lazy(() => [
        this.userCollection(),
        this.campaignCollection(),
        this.sceneCollection(),
        this.tokenCollection()
    ]);

    async start() {
        require("dotenv").config();
        console.log(`Serving static files from ${this.staticPath()}`);
        this.app().use(express.static(this.staticPath()));
        this.app().use(express.json());

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

        // Routes need to be connected after auth
        connectRoutes(this.userManager().routes(), this.app());
        connectRoutes(this.campaignManager().routes(), this.app());
        connectRoutes(this.sceneManager().routes(), this.app());
        connectRoutes(this.tokenManager().routes(), this.app());

        for (const c of this.collections()) {
            await c.initialize();
        }

        this.http().listen(this.port(), () =>
            console.log(`Example app listening on port ${this.port()}!`)
        );
    }
}
