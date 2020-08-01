import { Collection } from "../../utils/Collection";
import { GameMode } from "../game-mode/GameMode";
import { Entity } from "./Entity";
import { Scene } from "./Scene";

export class Campaign {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly scenes: Collection<Scene>,
        readonly entities: Collection<Entity>,
        readonly gameMode: GameMode
    ) {}
}
