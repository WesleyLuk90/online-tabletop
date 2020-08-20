import { Campaign } from "engine/engine/models/Campaign";
import { Scene } from "engine/engine/models/Scene";
import { Token } from "engine/engine/models/Token";
import { User } from "engine/engine/models/User";
import { Layer } from "engine/src/engine/models/Layer";
import { Color, Colors } from "engine/src/utils/Color";
import { checkNotNull, notNull } from "../../util/Nullable";
import { EntityCollection } from "../EntityCollection";
import { TokenCollection } from "../tokens/TokenCollection";
import { TokenSelection } from "../tokens/TokenSelection";
import { GameStateBuilder, RawGameState } from "./GameStateBuilder";

export class GameState implements RawGameState {
    static newGameState(
        sessionID: string,
        campaign: Campaign,
        user: User,
        scenes: Scene[]
    ) {
        return new GameState(
            sessionID,
            campaign,
            user,
            scenes,
            "",
            TokenCollection.empty(),
            false,
            TokenSelection.empty(),
            EntityCollection.empty(),
            ""
        );
    }

    constructor(
        readonly sessionID: string,
        readonly campaign: Campaign,
        readonly user: User,
        readonly scenes: Scene[],
        readonly activeLayer: string,
        readonly tokens: TokenCollection,
        readonly loading: boolean,
        readonly selectedTokens: TokenSelection,
        readonly entities: EntityCollection,
        readonly editEntity: string
    ) {}

    builder() {
        return new GameStateBuilder(this);
    }

    build(f: (b: GameStateBuilder) => GameStateBuilder): GameState {
        return f(this.builder()).build();
    }

    getMySceneID(): string {
        const player = this.campaign.players.find((p) => p.id === this.user.id);
        if (player == null || player.id === "") {
            return this.campaign.id;
        }
        return player.id;
    }

    getMyScene(): Scene | null {
        const id = this.getMySceneID();
        return this.scenes.find((s) => s.id === id) || null;
    }

    getScene(sceneID: string): Scene {
        return checkNotNull(this.scenes.find((s) => s.id === sceneID));
    }

    getActiveLayer(): Layer | null {
        const scene = this.getMyScene();
        if (scene == null) {
            return null;
        }
        const layer = scene.layers.find((l) => l.id === this.activeLayer);
        if (layer == null) {
            return scene.layers[0] || null;
        }
        return layer;
    }

    getLayerColor(layerID: string): Color {
        return (
            this.getMyScene()?.layers.find((l) => l.id === layerID)?.color ??
            Colors[3]
        );
    }

    getSelectedTokens(): Token[] {
        return this.selectedTokens
            .asList()
            .map((t) => this.tokens.byId(t))
            .filter(notNull);
    }
}
