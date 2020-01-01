import Axios from "axios";
import { parse } from "protocol/src/Parse";
import { Scene, SceneSchema } from "protocol/src/Scene";

function toScene(data: any) {
    return parse(data, SceneSchema);
}

export class SceneRequests {
    static async create(scene: Scene): Promise<void> {
        await Axios.post(`/api/campaigns/${scene.campaignID}/scenes`, scene);
    }

    static async update(scene: Scene): Promise<void> {
        await Axios.post(
            `/api/campaigns/${scene.campaignID}/scenes/${scene.sceneID}`,
            scene
        );
    }

    static async get(campaignID: string, sceneID: string): Promise<Scene> {
        const response = await Axios.get(
            `/api/campaigns/${campaignID}/scenes/${sceneID}`
        );
        return toScene(response.data);
    }

    static async list(campaignID: string): Promise<Scene[]> {
        const response = await Axios.get(`/api/campaigns/${campaignID}/scenes`);
        return (response.data as any[]).map(toScene);
    }

    static async delete(campaignID: string, sceneID: string): Promise<void> {
        await Axios.delete(`/api/campaigns/${campaignID}/scenes/${sceneID}`);
    }
}
