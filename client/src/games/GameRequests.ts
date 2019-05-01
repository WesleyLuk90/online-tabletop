import Axios from "axios";

interface Game {
    id: number;
    name: string;
}

export class GameRequests {
    static async create(name: string): Promise<Game> {
        const response = await Axios.post("/api/games/create", { name });
        return response.data.game;
    }
}
