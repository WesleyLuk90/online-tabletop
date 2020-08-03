import { GameMode } from "../../engine/gamemode/GameMode";
import { Collection } from "../../utils/Collection";
import { CreatureEntityType } from "./CreatureEntityType";

export const FifthEditionGameMode = new GameMode(
    "5e",
    "D&D 5th Edition",
    Collection.of(CreatureEntityType)
);
