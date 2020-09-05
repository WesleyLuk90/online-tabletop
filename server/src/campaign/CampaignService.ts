import {
    Campaign,
    CampaignDataSerde,
    Collection,
    GameMode,
    Player,
    TODO,
    User,
    uuid,
} from "engine";
import { CampaignModel, CampaignStore } from "./CampaignStore";

export class CampaignService {
    constructor(readonly store: CampaignStore) {}

    async create(
        name: string,
        gameMode: GameMode,
        creator: User
    ): Promise<Campaign> {
        const campaign = Campaign.empty(uuid(), name, gameMode).update({
            owner: creator.id,
            players: Collection.of(
                new Player(creator.id, creator.displayName, true)
            ),
        });
        const model = new CampaignModel();
        model.setData(CampaignDataSerde.serialize(campaign));
        this.store.create(model);
        return campaign;
    }

    async get(id: string): Promise<Campaign> {
        return TODO();
    }
}
