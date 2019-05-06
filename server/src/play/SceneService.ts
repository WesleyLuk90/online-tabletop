import { DataTypes, Model, Op, Sequelize } from "sequelize";
import {
    Scene as SceneData,
    SceneValidator
} from "../../../client/src/play/protocol/Scene";
import { Token as TokenData } from "../../../client/src/play/protocol/Token";

class Scene extends Model {
    public id: number;
    public uuid: string;
    public game_id: number;
    public data: string;
}

class Token extends Model {
    public id: number;
    public uuid: string;
    public scene_id: number;
    public data: string;
}

async function updateSchema(sequelize: Sequelize) {
    Scene.init(
        {
            id: {
                type: new DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true
            },
            uuid: new DataTypes.STRING(),
            game_id: new DataTypes.INTEGER(),
            data: new DataTypes.TEXT()
        },
        {
            tableName: "scene",
            underscored: true,
            indexes: [
                {
                    fields: ["game_id", "uuid"],
                    unique: true
                }
            ],
            sequelize
        }
    );
    Token.init(
        {
            id: {
                type: new DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true
            },
            uuid: new DataTypes.STRING(),
            scene_id: new DataTypes.INTEGER(),
            data: new DataTypes.TEXT()
        },
        {
            tableName: "token",
            underscored: true,
            indexes: [
                {
                    fields: ["scene_id", "uuid"],
                    unique: true
                }
            ],
            sequelize
        }
    );

    await Scene.sync();
    await Token.sync();
}

function groupBy<T, K extends string | number>(
    values: T[],
    key: (t: T) => K
): Map<K, T[]> {
    const map: Map<K, T[]> = new Map();
    values.forEach(v => {
        const k = key(v);
        const existing = map.get(k);
        if (existing == null) {
            map.set(k, [v]);
        } else {
            map.set(k, [...existing, v]);
        }
    });
    return map;
}

export class SceneService {
    static async create(sequelize: Sequelize): Promise<SceneService> {
        await updateSchema(sequelize);
        return new SceneService();
    }

    async updateScene(gameId: string, scene: SceneData) {
        await Scene.upsert({
            game_id: gameId,
            uuid: scene.id,
            data: JSON.stringify({
                id: scene.id,
                name: scene.name
            })
        });
        if (scene.tokens.length > 0) {
            const createdScene = await Scene.findOne({
                where: { game_id: gameId, uuid: scene.id }
            });
            for (let token of scene.tokens) {
                await this.createToken(createdScene.id.toString(), token);
            }
        }
    }

    async list(gameId: string): Promise<SceneData[]> {
        const scenes = await Scene.findAll({
            where: { game_id: gameId }
        });
        const tokens = await Token.findAll({
            where: { scene_id: { [Op.in]: scenes.map(s => s.id) } }
        });
        const tokensByScene = groupBy(tokens, t => t.scene_id);
        return scenes.map(s => {
            const data = JSON.parse(s.data);
            const tokens: Token[] = tokensByScene.get(s.id) || [];
            data.tokens = tokens.map(t => JSON.parse(t.data));
            return SceneValidator.decode(data).getOrElseL(e => {
                throw new Error("Error decoding scene\n" + e.toString());
            });
        });
    }

    async createToken(sceneId: string, token: TokenData) {
        return Token.upsert({
            scene_id: sceneId,
            uuid: token.id,
            data: JSON.stringify(token)
        });
    }
}
