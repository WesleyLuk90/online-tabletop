import { left } from "fp-ts/lib/Either";
import {
    AttributeResolver,
    RecursiveDefinition,
    ResolvedAttribute,
} from "../../src/engine/AttributeResolver";
import {
    ComputedAttribute,
    NumberAttribute,
} from "../../src/engine/models/Attribute";
import { CascadingEntity, ResolvedEntity } from "../../src/engine/References";
import { RollParser } from "../../src/engine/rolls/RollParser";
import { CreatureEntityType } from "../../src/gamemodes/5e/CreatureEntityType";
import { Character, CharacterTemplate } from "../TestCampaign";

describe("AttributeResolver", () => {
    it("should resolve default value", () => {
        expect(
            AttributeResolver.resolveChecked(
                new CascadingEntity([
                    new ResolvedEntity(
                        Character,
                        CharacterTemplate,
                        CreatureEntityType
                    ),
                ]),
                "str"
            )
        ).toEqual(new ResolvedAttribute(new NumberAttribute("str", 10)));
    });

    it("should resolve default computed", () => {
        expect(
            AttributeResolver.resolveChecked(
                new CascadingEntity([
                    new ResolvedEntity(
                        Character,
                        CharacterTemplate,
                        CreatureEntityType
                    ),
                ]),
                "str_mod"
            )
        ).toEqual(
            new ResolvedAttribute(
                new ComputedAttribute(
                    "str_mod",
                    RollParser.parseChecked("floor((str - 10) / 2)")
                ),
                new Map([["str", new NumberAttribute("str", 10)]])
            )
        );
    });

    it("should error on recursive variables", () => {
        expect(
            AttributeResolver.resolve(
                new CascadingEntity([
                    new ResolvedEntity(
                        Character.copy({
                            attributes: Character.attributes.add(
                                new ComputedAttribute(
                                    "str",
                                    RollParser.parseChecked("str_mod")
                                )
                            ),
                        }),
                        CharacterTemplate,
                        CreatureEntityType
                    ),
                ]),
                "str_mod"
            )
        ).toEqual(left(new RecursiveDefinition("str_mod", ["str_mod", "str"])));
    });
});
