import { Campaign } from "engine/engine/models/Campaign";
import { Scene } from "engine/engine/models/Scene";
import { Token } from "engine/engine/models/Token";
import { User } from "engine/engine/models/User";
import { Layer } from "engine/src/engine/models/Layer";
import { checkState } from "../../util/CheckState";
import { replaceValue } from "../../util/List";
import { GameEntity } from "../entity/GameEntity";
import { EntityCollection } from "../EntityCollection";
import { TokenCollection } from "../tokens/TokenCollection";
import { TokenSelection } from "../tokens/TokenSelection";
import { GameState } from "./GameState";

export interface RawGameState {
    readonly sessionID: string;
    readonly campaign: Campaign;
    readonly user: User;
    readonly scenes: Scene[];
    readonly activeLayer: string;
    readonly tokens: TokenCollection;
    readonly loading: boolean;
    readonly selectedTokens: TokenSelection;
    readonly entities: EntityCollection;
    readonly editEntity: string;
}

export class GameStateBuilder {
    constructor(private s: GameState) {}

    private update(updated: Partial<RawGameState>) {
        this.s = new GameState(
            updated.sessionID || this.s.sessionID,
            updated.campaign || this.s.campaign,
            updated.user || this.s.user,
            updated.scenes || this.s.scenes,
            updated.activeLayer || this.s.activeLayer,
            updated.tokens || this.s.tokens,
            updated.loading || this.s.loading,
            updated.selectedTokens || this.s.selectedTokens,
            updated.entities || this.s.entities,
            updated.editEntity || this.s.editEntity
        );
        return this;
    }

    build() {
        return this.s;
    }

    updateCampaign(campaign: Campaign) {
        return this.update({ campaign });
    }

    changeMyScene(sceneID: string) {
        return this.update({
            // campaign: {
            // ...this.s.campaign,
            // players: replaceValue(
            //     this.s.campaign.players,
            //     (p) => p.userID === this.s.user.id,
            //     (p) => ({ ...p, sceneID })
            // ),
            // },
        });
    }

    changeDefaultScene(sceneID: string) {
        return this.update({
            // campaign: { ...this.s.campaign, id: sceneID },
        });
    }

    updateScene(sceneID: string, scene: Partial<Scene>) {
        checkState(
            this.s.scenes.some((s) => s.id === sceneID),
            `Did not find scene with id ${sceneID}`
        );
        return this.update({
            scenes: replaceValue(
                this.s.scenes,
                (s) => s.id === sceneID,
                (s) => ({ ...s, ...scene })
            ),
        });
    }

    upsertScene(scene: Scene) {
        if (this.s.scenes.some((s) => s.id === scene.id)) {
            return this.updateScene(scene.id, scene);
        }
        return this.addScene(scene);
    }

    addScene(scene: Scene) {
        checkState(this.s.scenes.every((s) => s.id !== scene.id));

        return this.update({
            scenes: [...this.s.scenes, scene],
        });
    }

    deleteScene(sceneID: string) {
        return this.update({
            scenes: this.s.scenes.filter((s) => s.id !== sceneID),
        });
    }

    upsertLayer(sceneID: string, layer: Layer) {
        const scene = this.s.getScene(sceneID);
        if (scene.layers.some((l) => l.id === layer.id)) {
            return this.updateScene(sceneID, {
                layers: replaceValue(
                    scene.layers,
                    (l) => l.id === layer.id,
                    (l) => layer
                ),
            });
        } else {
            return this.updateScene(sceneID, {
                layers: [layer, ...scene.layers],
            });
        }
    }

    deleteLayer(sceneID: string, layer: Layer) {
        const scene = this.s.getScene(sceneID);
        return this.updateScene(sceneID, {
            layers: scene.layers.filter((l) => l.id !== layer.id),
        });
    }

    withActiveLayer(layer: Layer) {
        return this.update({ activeLayer: layer.id });
    }

    addToken(token: Token) {
        return this.update({ tokens: this.s.tokens.update(token) });
    }

    updateTokens(tokens: Token[]) {
        return this.update({ tokens: TokenCollection.fromList(tokens) });
    }

    updateToken(token: Token) {
        return this.update({ tokens: this.s.tokens.update(token) });
    }

    removeToken(tokenID: string) {
        return this.update({
            tokens: this.s.tokens.remove(tokenID),
        });
    }

    addSelection(tokens: Token[]) {
        return this.update({
            selectedTokens: this.s.selectedTokens.add(tokens),
        });
    }

    updateSelection(tokens: Token[]) {
        return this.update({
            selectedTokens: TokenSelection.fromTokens(tokens),
        });
    }

    updateEntities(entities: EntityCollection) {
        return this.update({
            entities,
        });
    }

    addEntity(entity: GameEntity) {
        return this.update({
            entities: this.s.entities.add(entity),
        });
    }

    updateEntity(entity: GameEntity) {
        return this.update({
            entities: this.s.entities.update(entity),
        });
    }

    removeEntity(entityID: string) {
        return this.update({
            entities: this.s.entities.delete(entityID),
        });
    }

    setEditEntity(entity: GameEntity | null) {
        if (entity == null) {
            return this.update({
                editEntity: "",
            });
        } else {
            return this.update({
                editEntity: entity.entityID(),
            });
        }
    }
}
