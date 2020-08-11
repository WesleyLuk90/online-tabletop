import { left } from "fp-ts/lib/Either";
import {
    AttributeNotFound,
    AttributeResolver,
    RecursiveDefinition,
    ResolvedExpression,
    ResolvedValues,
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
                RollParser.parseChecked("str")
            )
        ).toEqual(
            new ResolvedExpression(
                RollParser.parseChecked("str"),
                ResolvedValues.create(new NumberAttribute("str", 10))
            )
        );
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
                RollParser.parseChecked("str_mod")
            )
        ).toEqual(
            new ResolvedExpression(
                RollParser.parseChecked("str_mod"),
                ResolvedValues.create(
                    new NumberAttribute("str", 10),
                    new ComputedAttribute(
                        "str_mod",
                        RollParser.parseChecked("floor((str - 10) / 2)")
                    )
                )
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
                RollParser.parseChecked("str_mod")
            )
        ).toEqual(left(new RecursiveDefinition("str_mod", ["str_mod", "str"])));
    });

    it("should error on unknown variables", () => {
        expect(
            AttributeResolver.resolve(
                new CascadingEntity([
                    new ResolvedEntity(
                        Character.copy({
                            attributes: Character.attributes.add(
                                new ComputedAttribute(
                                    "str",
                                    RollParser.parseChecked("foo")
                                )
                            ),
                        }),
                        CharacterTemplate,
                        CreatureEntityType
                    ),
                ]),
                RollParser.parseChecked("str_mod")
            )
        ).toEqual(left(new AttributeNotFound("foo")));
    });
});
