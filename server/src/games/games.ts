import {
    DataTypes,
    HasManyAddAssociationMixin,
    Model,
    Sequelize
} from "sequelize";
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

export async function initializeGames(sequelize: Sequelize): Promise<Route[]> {
    await updateSchema(sequelize);

    return [
        {
            method: "get",
            path: "/api/games",
            handle: async (d, context) => {
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
        {
            method: "post",
            path: "/api/games/create",
            handle: async (d, context) => {
                const data = JSON.stringify(validateGame(d.body));
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
        {
            method: "get",
            path: "/api/games/get",
            handle: async (d: RequestData<{}, { id: string }>, context) => {
                const game = await Game.findOne({
                    where: {
                        id: d.query.id,
                        "$GamePermissions.user_id$": context.user_id
                    },
                    include: [
                        {
                            model: GamePermission
                        }
                    ]
                });
                if (game === null) {
                    throw new NotFoundError("Game", d.query.id);
                }
                return { game: formatGame(game) };
            }
        }
    ];
}
