import { AttributeResolver } from "../../src/engine/AttributeResolver";
import { ResolvedEntity } from "../../src/engine/References";
import { CreatureEntityType } from "../../src/gamemodes/5e/CreatureEntityType";
import { Character, CharacterTemplate } from "../TestCampaign";

describe("AttributeResolver", () => {
    it("should resolve", () => {
        expect(
            AttributeResolver.resolve(
                [
                    new ResolvedEntity(
                        Character,
                        CharacterTemplate,
                        CreatureEntityType
                    ),
                ],
                "str_mod"
            )
        ).toEqual(null);
    });
});
