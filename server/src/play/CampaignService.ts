import {
    Campaign as CampaignData,
    CampaignValidator
} from "protocol/lib/Campaign";
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
            tableName: "campaign",
            underscored: true,
            sequelize
        }
    );
    await Campaign.sync();
}

function serialize(data: CampaignData): string {
    return JSON.stringify({
        ...data,
        scenes: []
    });
}

export class CampaignService {
    static async create(sequelize: Sequelize): Promise<CampaignService> {
        await updateSchema(sequelize);
        return new CampaignService();
    }

    async getCampaign(gameId: number): Promise<CampaignData> {
        const data: CampaignData = {
            id: newId(),
            scene: "",
            scenes: []
        };
        const [campaign, _] = await Campaign.findOrCreate({
            where: { game_id: gameId },
            defaults: {
                game_id: gameId,
                data: serialize(data)
            }
        });
        return CampaignValidator.decode(JSON.parse(campaign.data)).fold(
            e => {
                throw e;
            },
            c => c
        );
    }

    async update(gameId: number, campaign: CampaignData): Promise<void> {
        await Campaign.update(
            { data: serialize(campaign) },
            {
                where: { game_id: gameId }
            }
        );
    }
}
