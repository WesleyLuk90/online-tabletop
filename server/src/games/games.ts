import { DataTypes, Model, Sequelize } from "sequelize";
import { NotFoundError } from "../errors";
import { RequestData, Route } from "../route";
import { GameData, validateGame } from "./validator";

export enum Permission {
    player = "player",
    game_master = "game_master"
}

class Game extends Model {
    public id: number;
    public data: string;
}

class GamePermission extends Model {
    public game_id: number;
    public username: string;
}

async function updateSchema(sequelize: Sequelize) {
    Game.init(
        {
            id: {
                type: new DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true
            },
            data: new DataTypes.TEXT()
        },
        {
            tableName: "game",
            underscored: true,
            sequelize
        }
    );
    GamePermission.init(
        {
            user_id: new DataTypes.STRING(),
            permission: new DataTypes.STRING()
        },
        {
            tableName: "game_permission",
            underscored: true,
            indexes: [
                {
                    fields: ["user_id"]
                }
            ],
            sequelize
        }
    );

    GamePermission.belongsTo(Game);
    Game.hasMany(GamePermission);
    await Game.sync();
    await GamePermission.sync();
}

function formatGame(game: Game): GameData {
    return {
        ...validateGame(JSON.parse(game.data)),
        id: game.id
    };
}

export async function initializeGames(sequelize: Sequelize): Promise<Route[]> {
    await updateSchema(sequelize);

    return [
        {
            method: "get",
            path: "/api/games",
            handle: async (d, context) => {
                const games = await Game.findAll({
                    include: [
                        {
                            model: GamePermission
                            // where: { user_id: context.user_id }
                        }
                    ]
                });
                return { games: games.map(formatGame) };
            }
        },
        {
            method: "post",
            path: "/api/games/create",
            handle: async (d, context) => {
                const data = JSON.stringify(validateGame(d.body));
                const game = await Game.create({
                    data: data
                });
                await GamePermission.create({
                    game_id: game.id,
                    user_id: context.user_id,
                    permission: Permission.game_master
                });
                return formatGame(game);
            }
        },
        {
            method: "get",
            path: "/api/games/get",
            handle: async (d: RequestData<{}, { id: string }>, context) => {
                const game = await Game.findByPk(d.query.id, {
                    include: [
                        {
                            model: GamePermission,
                            where: { user_id: context.user_id }
                        }
                    ]
                });
                if (game === null) {
                    throw new NotFoundError("Game", d.query.id);
                }
                return formatGame(game);
            }
        }
    ];
}
