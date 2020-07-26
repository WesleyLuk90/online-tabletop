import { CampaignSchema, ParseValidationError } from "../src/Schema";

describe("Schema", () => {
    it("should parse", () => {
        try {
            CampaignSchema.parse({
                foo: "bar",
            });
        } catch (e) {
            expect(e).toBeInstanceOf(ParseValidationError);
            return;
        }
        throw Error("Expected error to be thrown");
    });
});
