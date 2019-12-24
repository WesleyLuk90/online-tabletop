import { Scene } from "./Scene";

export interface SceneService {
    create(scene: Scene): Promise<Scene>;
    update(scene: Scene): Promise<Scene>;
    delete(sceneID: string): Promise<void>;
}
