import { Scene } from "./Scene";

export interface SceneService {
    list(gameID: string): Promise<Scene[]>;
    create(scene: Scene): Promise<Scene>;
    update(scene: Scene): Promise<Scene>;
    delete(scene: Scene): Promise<void>;
}
