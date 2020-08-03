import { Collection } from "../../utils/Collection";
import { EntityType } from "../models/EntityType";

export class GameMode {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly entityTypes: Collection<EntityType>
    ) {}
}
