import { Campaign } from "engine/engine/models/Campaign";
import { newUUID } from "engine/engine/models/Id";
import { Role } from "engine/engine/models/Role";
import { Update } from "engine/engine/models/Update";
import { User } from "engine/engine/models/User";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";
import { Callback } from "../util/Callback";
import { assertExhaustive } from "../util/Exaustive";
import { checkNotNull } from "../util/Nullable";
import { CampaignEventHandler } from "./CampaignEventHandler";
import { EntityManager } from "./EntityManager";
import { GameEvent } from "./gamestate/events/GameEvent";
import { GameState } from "./gamestate/GameState";
import { SceneService } from "./SceneService";
import { Socket } from "./Socket";
import { TokenManager } from "./TokenManager";

function isManager(campaign: Campaign, userID: string) {
    return campaign.players.some(
        (p) => p.userID === userID && p.role === Role.manager
    );
}

export class CampaignLoader {
    private socket: Socket | null = null;

    private sessionID = newUUID();

    constructor(
        private campaignID: string,
        private user: User,
        private update: Callback<GameEvent | GameState | null>,
        private eventHandler: CampaignEventHandler,
        private tokenManager: TokenManager,
        private entityManager: EntityManager
    ) {}

    async start() {
        if (this.socket != null) {
            throw new Error("Already started");
        }
        this.socket = new Socket(
            () => this.loadCampaign(),
            (u) => this.handleUpdate(u),
            () => this.update(null),
            this.campaignID
        );
    }

    handleUpdate(update: Update) {
        switch (update.type) {
            case "campaign":
                this.eventHandler.handleCampaignUpdate(update);
                break;
            case "scene":
                this.eventHandler.updateScene(update);
                break;
            case "token":
                this.tokenManager.applyRemoteUpdate(update);
                break;
            case "entity":
                this.entityManager.applyRemoteUpdate(update.update);
                break;
            default:
                assertExhaustive(update);
        }
    }

    stop() {
        checkNotNull(this.socket, "Not running").close();
    }

    private async loadCampaign() {
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
            const gameState = GameState.newGameState(
                this.sessionID,
                campaign,
                this.user,
                scenes
            );
            this.update(gameState);
            this.tokenManager.updateScene(gameState.getMySceneID());
            this.entityManager.load();
        }
    }
}
