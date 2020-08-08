import {
    EntityReference,
    SubEntityReference,
} from "../../src/engine/models/Reference";
import { References, ResolvedEntity } from "../../src/engine/References";
import {
    Character,
    CharacterTemplate,
    Dagger,
    DaggerTemplate,
    TestCampaign,
} from "../TestCampaign";

describe("References", () => {
    it("should resolve", () => {
        expect(
            References.resolveChecked(
                new EntityReference(Character.id, [
                    new SubEntityReference("inventory", Dagger.id),
                ]),
                TestCampaign
            )
        ).toEqual([
            new ResolvedEntity(Character, CharacterTemplate),
            new ResolvedEntity(Dagger, DaggerTemplate),
        ]);
    });
});
