import { Game } from "./Game";

export class GameManager {
    games: Game[] = [];

    async getGame(id: string): Promise<Game> {
        const game = this.games.find(game => game.id === id);
        if (game != null) {
            return game;
        }
        const newGame = new Game(id); // FIXME load game
        this.games.push(newGame);
        return newGame;
    }
}
