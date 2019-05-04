import {
    DataTypes,
    HasManyAddAssociationMixin,
    Model,
    Sequelize
} from "sequelize";
import { NotFoundError } from "../errors";
import { GameData } from "./validator";

export class Game extends Model {
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
    public permission: Permission;
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

export enum Permission {
    player = "player",
    game_master = "game_master"
}

export class GameService {
    static async create(sequelize: Sequelize): Promise<GameService> {
        await updateSchema(sequelize);
        return new GameService();
    }

    async list(playerId: string): Promise<Game[]> {
        return Game.findAll({
            where: { "$GamePermissions.user_id$": playerId },
            include: [
                {
                    model: GamePermission
                }
            ]
        });
    }

    async get(gameId: string): Promise<Game> {
        const game = await Game.findByPk(gameId);
        if (game === null) {
            throw new NotFoundError("Game", gameId);
        }
        return game;
    }

    async create(gameData: GameData, gameMasterId: string): Promise<Game> {
        const game = await Game.create({
            data: JSON.stringify(gameData),
            GamePermissions: [
                {
                    user_id: gameMasterId,
                    permission: Permission.game_master
                }
            ]
        });
        game.addGamePermission(
            await GamePermission.create({
                user_id: gameMasterId,
                permission: Permission.game_master
            })
        );
        return game;
    }

    async getPermission(
        gameId: string,
        playerId: string
    ): Promise<Permission | null> {
        const permission = await GamePermission.findOne({
            where: {
                user_id: playerId,
                game_id: gameId
            }
        });
        if (permission == null) {
            return null;
        }
        return permission.permission;
    }
}
