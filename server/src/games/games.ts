import {
    DataTypes,
    HasManyAddAssociationMixin,
    Model,
    Sequelize
} from "sequelize";
import { NotFoundError } from "../errors";
import { Context, Routes } from "../route";
import { GameData, validateGame } from "./validator";

export enum Permission {
    player = "player",
    game_master = "game_master"
}

class Game extends Model {
    public id: number;
    public data: string;

    public addGamePermission!: HasManyAddAssociationMixin<
        GamePermission,
        number
    >;
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

export async function initializeGames(sequelize: Sequelize): Promise<Routes> {
    await updateSchema(sequelize);

    return {
        "/api/games": {
            method: "get",
            handle: async context => {
                const games = await Game.findAll({
                    where: { "$GamePermissions.user_id$": context.user_id },
                    include: [
                        {
                            model: GamePermission
                        }
                    ]
                });
                return { games: games.map(formatGame) };
            }
        },
        "/api/games/create": {
            method: "post",
            handle: async (context: Context<GameData>) => {
                const data = JSON.stringify(validateGame(context.data.body));
                const game = await Game.create({
                    data: data,
                    GamePermissions: [
                        {
                            user_id: context.user_id,
                            permission: Permission.game_master
                        }
                    ]
                });
                game.addGamePermission(
                    await GamePermission.create({
                        user_id: context.user_id,
                        permission: Permission.game_master
                    })
                );
                return { game: formatGame(game) };
            }
        },
        "/api/games/get": {
            method: "get",
            handle: async (context: Context<{}, { id: string }>) => {
                const game = await Game.findOne({
                    where: {
                        id: context.data.query.id,
                        "$GamePermissions.user_id$": context.user_id
                    },
                    include: [
                        {
                            model: GamePermission
                        }
                    ]
                });
                if (game === null) {
                    throw new NotFoundError("Game", context.data.query.id);
                }
                return { game: formatGame(game) };
            }
        }
    };
}
