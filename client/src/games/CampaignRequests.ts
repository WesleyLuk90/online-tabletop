import Axios from "axios";

export class CampaignRequests {
    static async create(name: string): Promise<Game> {
        const response = await Axios.post("/api/games/create", { name });
        return response.data.game;
    }

    static async list(): Promise<Game[]> {
        const res = await Axios.get("/api/games");
        return res.data.games;
    }
}
