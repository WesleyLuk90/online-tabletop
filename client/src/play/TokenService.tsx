import Axios from "axios";

export class TokenService {
    static async get(gameId: string): Promise<{ token: string }> {
        const response = await Axios.get(`/api/play`, {
            params: { gameId }
        });
        return response.data;
    }
}
