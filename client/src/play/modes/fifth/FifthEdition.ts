import { GameMode } from "../GameMode";
import { ClassType } from "./ClassType";
import { CreatureType } from "./Creature";

export const FifthEdition: GameMode = {
    id: "5e",
    name: "5th Edition",
    entityTypes: [CreatureType, ClassType],
    tokenEntities: [
        {
            entityTypeID: "creature"
        }
    ]
};
