import { Campaign } from "protocol/src/Campaign";
import { Layer, Scene } from "protocol/src/Scene";
import { Token } from "protocol/src/Token";
import { User } from "protocol/src/User";
import { checkNotNull } from "../util/Nullable";
import { GameStateBuilder, RawGameState } from "./GameStateBuilder";
import { TokenCollection } from "./tokens/TokenCollection";

export class GameState implements RawGameState {
    private tokenCollection: TokenCollection;

    constructor(
        readonly campaign: Campaign,
        readonly user: User,
        readonly scenes: Scene[],
        readonly activeLayer: string,
        readonly tokens: Token[]
    ) {
        this.tokenCollection = new TokenCollection(tokens);
    }

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
            return scene.layers[0] || null;
        }
        return layer;
    }

    getTokens() {
        return this.tokenCollection;
    }
}
