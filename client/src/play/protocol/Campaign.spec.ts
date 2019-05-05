import { right } from "fp-ts/lib/Either";
import { Campaign, CampaignValidator } from "./Campaign";

describe("Campaign", () => {
    it("should validate", () => {
        const campaign: Campaign = {
            id: "foo",
            scenes: [
                {
                    id: "bar",
                    name: "Foo",
                    tokens: []
                }
            ]
        };
        expect(CampaignValidator.decode(campaign)).toEqual(right(campaign));
    });
});
