import { left } from "fp-ts/lib/Either";
import {
    EntityReference,
    SubEntityReference,
} from "../../src/engine/models/Reference";
import {
    EntityNotFound,
    References,
    ResolvedEntity,
    SubEntityNotFound,
} from "../../src/engine/References";
import { CreatureEntityType } from "../../src/gamemodes/5e/CreatureEntityType";
import { ItemEntityType } from "../../src/gamemodes/5e/ItemEntityType";
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
            new ResolvedEntity(
                Character,
                CharacterTemplate,
                CreatureEntityType
            ),
            new ResolvedEntity(Dagger, DaggerTemplate, ItemEntityType),
        ]);
    });

    it("should error", () => {
        expect(
            References.resolve(new EntityReference("nope", []), TestCampaign)
        ).toEqual(left(new EntityNotFound("nope")));
        expect(
            References.resolve(
                new EntityReference(Character.id, [
                    new SubEntityReference("nope", Dagger.id),
                ]),
                TestCampaign
            )
        ).toEqual(
            left(
                new SubEntityNotFound(new SubEntityReference("nope", Dagger.id))
            )
        );
    });
});
