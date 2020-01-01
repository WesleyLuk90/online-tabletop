import { parse } from "protocol/src/Parse";
import { Scene, SceneSchema } from "protocol/src/Scene";
import { Route } from "../Route";
import { CampaignPermissionService } from "./CampaignPermissionService";
import { SceneStorage } from "./SceneStorage";

function parseScene(data: {}) {
    return parse(data, SceneSchema);
}

const PATH = "/api/campaigns/:campaignID";

export class SceneManager {
    constructor(
        private sceneStorage: SceneStorage,
        private permissionService: CampaignPermissionService
    ) {}

    routes(): Route[] {
        return [
            Route.create("post", `${PATH}/scenes`, (userID, data) =>
                this.create(userID, parseScene(data.body()))
            ),
            Route.create("post", `${PATH}/scenes/:sceneID`, (userID, data) =>
                this.update(userID, parseScene(data.body()))
            ),
            Route.create("get", `${PATH}/scenes/:sceneID`, (userID, data) =>
                this.get(userID, data.url("campaignID"), data.url("sceneID"))
            ),
            Route.create("get", `${PATH}/scenes`, (userID, data) =>
                this.list(userID, data.url("campaignID"))
            ),
            Route.create("delete", `${PATH}/scenes/:sceneID`, (userID, data) =>
                this.delete(
                    userID,
                    data.url("campaignID"),
                    data.url("sceneID")
                ).then(() => ({}))
            )
        ];
    }

    async create(userID: string, scene: Scene): Promise<Scene> {
        return this.permissionService.requireManager(
            {
                campaignID: scene.campaignID,
                userID
            },
            () => {
                return this.sceneStorage.create(scene);
            }
        );
    }

    async update(userID: string, scene: Scene): Promise<Scene> {
        return this.permissionService.requireManager(
            {
                campaignID: scene.campaignID,
                userID
            },
            () => this.sceneStorage.update(scene)
        );
    }

    async get(
        userID: string,
        campaignID: string,
        sceneID: string
    ): Promise<Scene> {
        return this.permissionService.requirePlayer(
            {
                campaignID,
                userID
            },
            () => this.sceneStorage.get({ campaignID, sceneID })
        );
    }

    async list(userID: string, campaignID: string): Promise<Scene[]> {
        return this.permissionService.requirePlayer(
            {
                campaignID,
                userID
            },
            () => this.sceneStorage.list(campaignID)
        );
    }

    async delete(
        userID: string,
        campaignID: string,
        sceneID: string
    ): Promise<void> {
        await this.permissionService.requireManager(
            {
                campaignID,
                userID
            },
            () => this.sceneStorage.delete({ campaignID, sceneID })
        );
    }
}
