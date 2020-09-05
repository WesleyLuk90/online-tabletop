import { FifthEditionGameMode, User } from "engine";
import { CampaignModule } from "../../src/campaign/CampaignModule";
import { DatabaseFixture } from "../storage/DatabaseFixture";

describe("CamapignIntegration", () => {
    const dbFixture = new DatabaseFixture();

    it("should create", async () => {
        const module = new CampaignModule(dbFixture.db());
        await dbFixture.module.migrator().migrate();

        const campaign = await module
            .service()
            .create("Foo", FifthEditionGameMode, new User("foo", "bar"));

        expect(await module.service().get(campaign.id)).toEqual(campaign);
    });
});
