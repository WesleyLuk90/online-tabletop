import { Campaign } from "protocol/src/Campaign";
import { Scene } from "protocol/src/Scene";
import { User } from "protocol/src/User";
import { checkState } from "../util/CheckState";
import { replaceValue } from "../util/List";

interface State {
    readonly campaign: Campaign;
    readonly user: User;
    readonly scenes: Scene[];
}

export class GameState implements State {
    constructor(
        readonly campaign: Campaign,
        readonly user: User,
        readonly scenes: Scene[]
    ) {}

    copy(updated: Partial<State>) {
        return new GameState(
            updated.campaign || this.campaign,
            updated.user || this.user,
            updated.scenes || this.scenes
        );
    }

    updateCampaign(campaign: Campaign): GameState {
        return this.copy({ campaign });
    }

    getMySceneID(): string {
        const player = this.campaign.players.find(
            p => p.userID === this.user.id
        );
        if (player == null) return "";
        return player.sceneID;
    }

    getMyScene(): Scene | null {
        const id = this.getMySceneID() || this.campaign.sceneID;
        return this.scenes.find(s => s.sceneID === id) || null;
    }

    updateScene(scene: Scene): GameState {
        return this.copy({
            scenes: replaceValue(
                this.scenes,
                s => s.sceneID === scene.sceneID,
                s => scene
            )
        });
    }

    addScene(scene: Scene): GameState {
        checkState(this.scenes.every(s => s.sceneID !== scene.sceneID));

        return this.copy({
            scenes: [...this.scenes, scene]
        });
    }

    addOrUpdateScene(scene: Scene): GameState {
        if (this.scenes.some(s => s.sceneID === scene.sceneID)) {
            return this.updateScene(scene);
        }
        return this.addScene(scene);
    }

    deleteScene(sceneID: string): GameState {
        return this.copy({
            scenes: this.scenes.filter(s => s.sceneID !== sceneID)
        });
    }
}
