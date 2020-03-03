import { GameMode } from "../GameMode";
import { ClassType } from "./ClassType";
import { CreatureType } from "./Creature";

export const FifthEdition = new GameMode(
    "5e",
    "5th Edition",
    [CreatureType, ClassType],
    [
        {
            entityTypeID: "creature"
        }
    ]
);
