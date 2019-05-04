import { Sequelize } from "sequelize";
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

export async function initializeGames(sequelize: Sequelize): Promise<Routes> {
    const gameService = await GameService.create(sequelize);

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
            handle: async (context: Context<{}, { id: string }>) => {
                const permission = await gameService.getPermission(
                    context.data.query.id,
                    context.user_id
                );
                if (permission == null) {
                    throw new PermissionError();
                }
                const game = await gameService.get(context.data.query.id);
                if (game === null) {
                    throw new NotFoundError("Game", context.data.query.id);
                }
                return { game: formatGame(game) };
            }
        }
    };
}
