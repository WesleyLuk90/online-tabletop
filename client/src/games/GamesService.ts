import axios from "axios";

interface Game {
    id: number;
    name: string;
}

export class GamesService {
    static async list(): Promise<Game> {
        const res = await axios.get("/api/games");
        return res.data;
    }
}
