import { CampaignData, CampaignDataSchema } from "engine";
import { BaseModel } from "../storage/BaseModel";
import { BaseSchema } from "../storage/BaseSchema";
import { BaseStore, Row } from "../storage/BaseStore";
import { Database } from "../storage/Database";

export const CampaignSchema = new (class extends BaseSchema {
    data = this.jsonField("data", CampaignDataSchema);
})("campaigns");

export class CampaignModel extends BaseModel {
    constructor(row: Row = new Row()) {
        super(row);
    }

    setData(data: CampaignData) {
        this.row.set(CampaignSchema.data, data);
        return this;
    }
}

export class CampaignStore extends BaseStore<CampaignModel> {
    constructor(db: Database) {
        super(db, CampaignSchema, (r) => new CampaignModel(r));
    }
}
