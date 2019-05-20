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
    return JSON.stringify(data);
}

function defaultCampaign(): CampaignData {
    return {
        id: newId(),
        scene: "",
        scenes: []
    };
}

export class CampaignService {
    static async create(sequelize: Sequelize): Promise<CampaignService> {
        await updateSchema(sequelize);
        return new CampaignService();
    }

    async getCampaign(gameId: string): Promise<CampaignData> {
        const [campaign, _] = await Campaign.findOrCreate({
            where: { game_id: gameId },
            defaults: {
                data: serialize(defaultCampaign())
            }
        });
        return CampaignValidator.decode(JSON.parse(campaign.data)).fold(
            e => {
                throw e;
            },
            c => c
        );
    }

    async update(gameId: string, campaign: CampaignData): Promise<void> {
        await Campaign.update(
            { data: serialize(campaign) },
            {
                where: { game_id: gameId }
            }
        );
    }
}
