import { Collection } from "./Collection";
import { Entity } from "./Entity";
import { Scene } from "./Scene";

export class Campaign {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly scenes: Collection<Scene>,
        readonly entities: Collection<Entity>
    ) {}
}
