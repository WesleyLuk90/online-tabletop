import { Scene } from "protocol/src/Scene";
import { Route } from "../Route";
import { CampaignPermissionService } from "./CampaignPermissionService";
import { SceneStorage } from "./SceneStorage";

export class SceneManager {
    constructor(
        private sceneStorage: SceneStorage,
        private permissionService: CampaignPermissionService
    ) {}

    routes(): Route[] {
        return [];
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
        await this.permissionService.requireManager(
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
        await this.permissionService.requirePlayer(
            {
                campaignID,
                userID
            },
            () => this.sceneStorage.get(campaignID, sceneID)
        );
    }

    async list(gameID: string): Promise<Scene[]> {
        await this.permissionService.requirePlayer({
            campaignID: scene.campaignID,
            userID
        });
    }

    async delete(scene: Scene): Promise<void> {
        await this.permissionService.requireManager({
            campaignID: scene.campaignID,
            userID
        });
    }
}
