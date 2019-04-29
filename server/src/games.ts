import { DataTypes, Model, Sequelize } from "sequelize";
import { Route } from "./route";

export enum Permission {
    player = "player",
    game_master = "game_master"
}

class Game extends Model {
    public id: number;
    public value: string;
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
                            model: GamePermission,
                            where: { user_id: context.user_id }
                        }
                    ]
                });
                return { games: games };
            }
        }
    ];
}
