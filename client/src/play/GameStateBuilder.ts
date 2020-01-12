import { Campaign } from "protocol/src/Campaign";
import { Layer, Scene } from "protocol/src/Scene";
import { User } from "protocol/src/User";
import { checkState } from "../util/CheckState";
import { replaceValue } from "../util/List";
import { GameState } from "./GameState";

interface State {
    readonly campaign: Campaign;
    readonly user: User;
    readonly scenes: Scene[];
}

export class GameStateBuilder {
    constructor(private s: GameState) {}

    private update(updated: Partial<State>) {
        this.s = new GameState(
            updated.campaign || this.s.campaign,
            updated.user || this.s.user,
            updated.scenes || this.s.scenes
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
            campaign: {
                ...this.s.campaign,
                players: replaceValue(
                    this.s.campaign.players,
                    p => p.userID === this.s.user.id,
                    p => ({ ...p, sceneID })
                )
            }
        });
    }

    changeDefaultScene(sceneID: string) {
        return this.update({
            campaign: { ...this.s.campaign, sceneID }
        });
    }

    updateScene(sceneID: string, scene: Partial<Scene>) {
        checkState(
            this.s.scenes.some(s => s.sceneID === sceneID),
            `Did not find scene with id ${sceneID}`
        );
        return this.update({
            scenes: replaceValue(
                this.s.scenes,
                s => s.sceneID === sceneID,
                s => ({ ...s, ...scene })
            )
        });
    }

    upsertScene(scene: Scene) {
        if (this.s.scenes.some(s => s.sceneID === scene.sceneID)) {
            return this.updateScene(scene.sceneID, scene);
        }
        return this.addScene(scene);
    }

    addScene(scene: Scene) {
        checkState(this.s.scenes.every(s => s.sceneID !== scene.sceneID));

        return this.update({
            scenes: [...this.s.scenes, scene]
        });
    }

    deleteScene(sceneID: string) {
        return this.update({
            scenes: this.s.scenes.filter(s => s.sceneID !== sceneID)
        });
    }

    upsertLayer(sceneID: string, layer: Layer) {
        const scene = this.s.getScene(sceneID);
        if (scene.layers.some(l => l.id === layer.id)) {
            return this.updateScene(sceneID, {
                layers: replaceValue(
                    scene.layers,
                    l => l.id === layer.id,
                    l => layer
                )
            });
        } else {
            return this.updateScene(sceneID, {
                layers: [layer, ...scene.layers]
            });
        }
    }

    deleteLayer(sceneID: string, layer: Layer) {
        const scene = this.s.getScene(sceneID);
        return this.updateScene(sceneID, {
            layers: scene.layers.filter(l => l.id !== layer.id)
        });
    }
}
