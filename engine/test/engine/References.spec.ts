import {
    EntityReference,
    SubEntityReference,
} from "../../src/engine/models/Reference";
import { References } from "../../src/engine/References";
import {
    Character,
    CharacterTemplate,
    Dagger,
    DaggerTemplate,
    TestCampaign,
} from "../TestCampaign";

describe("References", () => {
    it("should resolve", () => {
        const resolved = References.resolveChecked(
            new EntityReference(Character.id, [
                new SubEntityReference("inventory", Dagger.id),
            ]),
            TestCampaign
        );
        expect(resolved).toHaveLength(2);
        expect(resolved[0]).toMatchObject({
            entity: Character,
            template: CharacterTemplate,
        });
        expect(resolved[1]).toMatchObject({
            entity: Dagger,
            template: DaggerTemplate,
        });
    });
});
