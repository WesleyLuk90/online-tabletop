import { Campaign } from "protocol/src/Campaign";
import { Layer, Scene } from "protocol/src/Scene";
import { User } from "protocol/src/User";
import { checkNotNull } from "../util/Nullable";
import { GameStateBuilder } from "./GameStateBuilder";

export class GameState {
    constructor(
        readonly campaign: Campaign,
        readonly user: User,
        readonly scenes: Scene[],
        readonly activeLayer: string | null
    ) {}

    builder() {
        return new GameStateBuilder(this);
    }

    build(f: (b: GameStateBuilder) => GameStateBuilder): GameState {
        return f(this.builder()).build();
    }

    getMySceneID(): string {
        const player = this.campaign.players.find(
            p => p.userID === this.user.id
        );
        if (player == null || player.sceneID === "") {
            return this.campaign.sceneID;
        }
        return player.sceneID;
    }

    getMyScene(): Scene | null {
        const id = this.getMySceneID();
        return this.scenes.find(s => s.sceneID === id) || null;
    }

    getScene(sceneID: string): Scene {
        return checkNotNull(this.scenes.find(s => s.sceneID === sceneID));
    }

    getActiveLayer(): Layer | null {
        const scene = this.getMyScene();
        if (scene == null) {
            return null;
        }
        const layer = scene.layers.find(l => l.id === this.activeLayer);
        if (layer == null) {
            return null;
        }
        return layer;
    }
}
