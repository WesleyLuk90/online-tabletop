import { Action } from "../src/engine/models/Action";
import {
    Attribute,
    NumberAttribute,
    SubEntityAttribute,
} from "../src/engine/models/Attribute";
import { Campaign } from "../src/engine/models/Campaign";
import { Entity } from "../src/engine/models/Entity";
import { EntityTemplate } from "../src/engine/models/EntityTemplate";
import { RollParser } from "../src/engine/rolls/RollParser";
import { CreatureEntityType } from "../src/gamemodes/5e/CreatureEntityType";
import { FifthEditionGameMode } from "../src/gamemodes/5e/FifthEdition";
import { ItemEntityType } from "../src/gamemodes/5e/ItemEntityType";
import { Collection } from "../src/utils/Collection";
import { uuid } from "../src/utils/Uuid";

export const DaggerTemplate = new EntityTemplate(
    uuid(),
    ItemEntityType.id,
    Collection.empty(),
    Collection.of(
        new Action(
            "melee_attack",
            "Melee Attack",
            "Melee Attack",
            RollParser.parseChecked("1d4+max(str_weapon_mod,dex_weapon_mod)")
        )
    )
);
export const Dagger = new Entity(
    uuid(),
    DaggerTemplate.id,
    Collection.empty(),
    Collection.of()
);
export const CharacterTemplate = new EntityTemplate(
    uuid(),
    CreatureEntityType.id,
    Collection.empty(),
    Collection.empty()
);
export const Character = new Entity(
    uuid(),
    CharacterTemplate.id,
    Collection.of<Attribute>(
        new NumberAttribute("strength", 15),
        new SubEntityAttribute("inventory", Collection.of(Dagger))
    )
);
export const TestCampaign = Campaign.empty(uuid(), "Game", FifthEditionGameMode)
    .addEntityTemplate(CharacterTemplate)
    .addEntity(Character)
    .addEntityTemplate(DaggerTemplate);
