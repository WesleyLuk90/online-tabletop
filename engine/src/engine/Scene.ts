import { Collection } from "./Collection";
import { Layer } from "./Layer";

export class Scene {
    constructor(readonly layers: Collection<Layer>) {}
}
