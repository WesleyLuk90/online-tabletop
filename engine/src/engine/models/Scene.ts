import { Layer } from "./Layer";

export class Scene {
    constructor(readonly id: string, readonly layers: Layer[]) {}
}
