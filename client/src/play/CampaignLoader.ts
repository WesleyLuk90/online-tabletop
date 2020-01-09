import { Campaign } from "protocol/src/Campaign";
import { Role } from "protocol/src/Role";
import { CampaignUpdate, Update } from "protocol/src/Update";
import { User } from "protocol/src/User";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";
import { assertExhaustive } from "../util/Exaustive";
import { GameState } from "./GameState";
import { SceneService } from "./SceneService";
import { Socket } from "./Socket";

function isManager(campaign: Campaign, userID: string) {
    return campaign.players.some(
        p => p.userID === userID && p.role === Role.manager
    );
}

export class CampaignLoader {
    socket: Socket;
    constructor(
        private campaignID: string,
        private user: User,
        private updateGameState: (
            updater: (gameState: GameState | null) => GameState | null
        ) => void
    ) {
        this.socket = new Socket(
            () => this.loadCampaign(),
            u => this.handleUpdate(u),
            () => updateGameState(() => null),
            campaignID
        );
    }

    handleUpdate(update: Update) {
        switch (update.type) {
            case "campaign":
                this.updateCampaign(update);
                break;
            case "scene":
                break;
            case "token":
                break;
            default:
                assertExhaustive(update);
        }
    }

    async updateCampaign(update: CampaignUpdate) {
        const campaign = await CampaignRequests.get(this.campaignID);
        this.updateGameState(state => state && state.updateCampaign(campaign));
    }

    close() {}

    async loadCampaign() {
        const campaign = await CampaignRequests.get(this.campaignID);
        const scenes = await SceneRequests.list(this.campaignID);
        if (scenes.length === 0 && isManager(campaign, this.user.id)) {
            const defaultScene = SceneService.createDefaultScene(
                this.campaignID
            );
            await SceneRequests.create(defaultScene);
            campaign.sceneID = defaultScene.sceneID;
            await CampaignRequests.update(campaign);
            this.loadCampaign();
        } else {
            this.updateGameState(
                () => new GameState(campaign, this.user, scenes)
            );
        }
    }
}
