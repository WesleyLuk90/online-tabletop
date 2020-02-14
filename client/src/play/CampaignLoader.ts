import { Campaign } from "protocol/src/Campaign";
import { newUUID } from "protocol/src/Id";
import { Role } from "protocol/src/Role";
import { Update } from "protocol/src/Update";
import { User } from "protocol/src/User";
import { CampaignRequests } from "../games/CampaignRequests";
import { SceneRequests } from "../games/SceneRequests";
import { assertExhaustive } from "../util/Exaustive";
import { CampaignEventHandler } from "./CampaignEventHandler";
import { EntityManager } from "./EntityManager";
import { GameState } from "./GameState";
import { SceneService } from "./SceneService";
import { Socket } from "./Socket";
import { TokenManager } from "./TokenManager";

function isManager(campaign: Campaign, userID: string) {
    return campaign.players.some(
        p => p.userID === userID && p.role === Role.manager
    );
}

export interface GameStateUpdate {
    (gameState: GameState): GameState;
}
export interface NullableGameStateUpdate {
    (gameState: GameState | null): GameState | null;
}
export interface GameStateUpdater {
    (update: GameStateUpdate): void;
}

export class CampaignLoader {
    socket: Socket;
    eventHandler: CampaignEventHandler;
    tokenManager: TokenManager;
    entityManager: EntityManager;

    private sessionID = newUUID();

    constructor(
        private campaignID: string,
        private user: User,
        private updateNullableState: (updater: NullableGameStateUpdate) => void
    ) {
        this.eventHandler = new CampaignEventHandler(this.updateState);
        this.socket = new Socket(
            () => this.loadCampaign(),
            u => this.handleUpdate(u),
            () => updateNullableState(() => null),
            campaignID
        );
        this.tokenManager = new TokenManager(
            this.sessionID,
            campaignID,
            this.updateState
        );
        this.entityManager = new EntityManager(
            this.sessionID,
            this.campaignID,
            this.updateState
        );
    }

    updateState: GameStateUpdater = (updater: GameStateUpdate) => {
        this.updateNullableState(state => {
            if (state == null) {
                return null;
            }
            return updater(state);
        });
    };

    handleUpdate(update: Update) {
        switch (update.type) {
            case "campaign":
                this.eventHandler.handleCampaignUpdate(update);
                break;
            case "scene":
                this.eventHandler.updateScene(update);
                break;
            case "token":
                this.tokenManager.handleTokenUpdate(update);
                break;
            case "entity":
                this.entityManager.handleEntityUpdate(update.update);
                break;
            default:
                assertExhaustive(update);
        }
    }

    close() {
        this.socket.close();
    }

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
            const gameState = GameState.newGameState(
                this.sessionID,
                campaign,
                this.user,
                scenes
            );
            this.updateNullableState(() => gameState);
            this.tokenManager.updateScene(gameState.getMySceneID());
            this.entityManager.load();
        }
    }
}
