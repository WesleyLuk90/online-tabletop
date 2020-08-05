import { Action } from "../src/engine/models/Action";
import { NumberAttribute } from "../src/engine/models/Attribute";
import { Campaign } from "../src/engine/models/Campaign";
import { Entity } from "../src/engine/models/Entity";
import { EntityTemplate } from "../src/engine/models/EntityTemplate";
import { RollParser } from "../src/engine/rolls/RollParser";
import { CreatureEntityType } from "../src/gamemodes/5e/CreatureEntityType";
import { FifthEditionGameMode } from "../src/gamemodes/5e/FifthEdition";
import { ItemEntityType } from "../src/gamemodes/5e/ItemEntityType";
import { Collection } from "../src/utils/Collection";
import { uuid } from "../src/utils/Uuid";

describe("Game", () => {
    it("should", () => {
        const pcTemplate = new EntityTemplate(
            uuid(),
            CreatureEntityType.id,
            Collection.empty(),
            Collection.empty()
        );
        const pc = new Entity(
            uuid(),
            pcTemplate.id,
            Collection.of(new NumberAttribute("strength", 15))
        );
        const daggerTemplate = new EntityTemplate(
            uuid(),
            ItemEntityType.id,
            Collection.empty(),
            Collection.of(
                new Action(
                    "melee_attack",
                    "Melee Attack",
                    "Melee Attack",
                    RollParser.parse("1d4+max(str_weapon_mod,dex_weapon_mod)")
                )
            )
        );
        const dagger = new Entity(
            uuid(),
            daggerTemplate.id,
            Collection.empty(),
            Collection.of()
        );
        Campaign.empty(uuid(), "Game", FifthEditionGameMode)
            .addEntityTemplate(pcTemplate)
            .addEntity(pc)
            .addEntityTemplate(daggerTemplate)
            .addEntity(dagger);
    });
});
