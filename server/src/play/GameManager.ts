import { Game } from "./Game";
import { GameStorage } from "./GameStorage";

export class GameManager {
    games: Game[] = [];

    constructor(private gameStorage: GameStorage) {}

    async getGame(id: string): Promise<Game> {
        const game = this.games.find(game => game.id === id);
        if (game != null) {
            return game;
        }
        const newGame = await this.gameStorage.getGame(id);
        this.games.push(newGame);
        return newGame;
    }
}
