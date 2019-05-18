import { CampaignService } from "../../src/play/CampaignService";
import { testDatabase } from "../DatabaseToolkit";

describe("CampaignService", () => {
    it("should get or create a campaign ", async () => {
        const db = await testDatabase();
        const service = await CampaignService.create(db);

        const campaign = await service.getCampaign(1);
        expect(campaign.id).toBeTruthy();

        campaign.scene = "10";
        await service.update(1, campaign);

        const updated = await service.getCampaign(1);
        expect(updated.id).toEqual(campaign.id);
        expect(updated.scene).toBe("10");
    });
});
