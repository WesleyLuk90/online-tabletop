import { NotFoundError, PermissionError } from "../errors";
import { Context, Routes } from "../route";
import { Game, GameService } from "./GameService";
import { GameData, validateGame } from "./validator";

function formatGame(game: Game): GameData {
    return {
        ...validateGame(JSON.parse(game.data)),
        id: game.id
    };
}

export function gameRoutes(gameService: GameService): Routes {
    return {
        "/api/games": {
            method: "get",
            handle: async context => {
                const games = await gameService.list(context.user_id);
                return { games: games.map(formatGame) };
            }
        },
        "/api/games/create": {
            method: "post",
            handle: async (context: Context<GameData>) => {
                const data = validateGame(context.data.body);
                const game = await gameService.create(data, context.user_id);
                return { game: formatGame(game) };
            }
        },
        "/api/games/get": {
            method: "get",
            handle: async (context: Context<{}, { gameId: string }>) => {
                const gameId = context.data.query.gameId || "";
                if (!gameId) {
                    throw new Error("Game id is required");
                }
                const permission = await gameService.getPermission(
                    gameId,
                    context.user_id
                );
                if (permission == null) {
                    throw new PermissionError();
                }
                const game = await gameService.get(gameId);
                if (game === null) {
                    throw new NotFoundError("Game", gameId);
                }
                return { game: formatGame(game) };
            }
        }
    };
}
