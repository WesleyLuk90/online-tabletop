import { Layer, Scene } from "protocol/src/Scene";
import { SceneRequests } from "../../../games/SceneRequests";
import { replaceValue } from "../../../util/List";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

abstract class AbstractSceneUpdater implements GameEventType {
    constructor(private sceneID: string) {}

    abstract updateScene(scene: Scene): Scene;

    update(gameState: GameState): GameState {
        const scene = gameState.scenes.find(s => s.sceneID === this.sceneID);
        if (scene == null) {
            return gameState;
        }
        const updated = this.updateScene(scene);
        SceneRequests.update(updated);
        return gameState.build(b => b.upsertScene(updated));
    }
}

export class RequestUpdateSceneLayers extends AbstractSceneUpdater {
    constructor(sceneID: string, private layers: Layer[]) {
        super(sceneID);
    }

    updateScene(scene: Scene): Scene {
        return { ...scene, ...this.layers };
    }
}

export class RequestCreateSceneLayer extends AbstractSceneUpdater {
    constructor(sceneID: string, private layer: Layer) {
        super(sceneID);
    }

    updateScene(scene: Scene): Scene {
        return { ...scene, layers: [...scene.layers, this.layer] };
    }
}

export class RequestUpdateSceneLayer extends AbstractSceneUpdater {
    constructor(sceneID: string, private layer: Layer) {
        super(sceneID);
    }

    updateScene(scene: Scene): Scene {
        return {
            ...scene,
            layers: replaceValue(
                scene.layers,
                l => l.id === this.layer.id,
                () => this.layer
            )
        };
    }
}

export class RequestDeleteSceneLayer extends AbstractSceneUpdater {
    constructor(sceneID: string, private layer: Layer) {
        super(sceneID);
    }

    updateScene(scene: Scene): Scene {
        return {
            ...scene,
            layers: scene.layers.filter(l => l.id !== this.layer.id)
        };
    }
}

export class RequestUpdateSceneLayerVisibility extends AbstractSceneUpdater {
    constructor(
        sceneID: string,
        private layerID: string,
        private playerVisible: boolean
    ) {
        super(sceneID);
    }

    updateScene(scene: Scene): Scene {
        return {
            ...scene,
            layers: replaceValue(
                scene.layers,
                l => l.id === this.layerID,
                l => ({ ...l, playerVisible: this.playerVisible })
            )
        };
    }
}
