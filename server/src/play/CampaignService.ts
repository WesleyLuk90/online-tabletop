import { Campaign as CampaignData } from "protocol/lib/Campaign";
import { newId } from "protocol/lib/Id";
import { DataTypes, Model, Sequelize } from "sequelize";

class Campaign extends Model {
    public id: number;
    public game_id: number;
    public data: string;
}

async function updateSchema(sequelize: Sequelize) {
    Campaign.init(
        {
            id: {
                type: new DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true
            },
            game_id: {
                type: new DataTypes.INTEGER(),
                unique: true
            },
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
    await Campaign.sync();
}
export class SceneService {
    static async create(sequelize: Sequelize): Promise<SceneService> {
        await updateSchema(sequelize);
        return new SceneService();
    }

    async getCampaign(gameId: string): Promise<CampaignData> {
        const newCampaign: CampaignData = {
            id: newId(),
            scenes: []
        };
        new Campaign({});
        throw new Error();
    }
}
