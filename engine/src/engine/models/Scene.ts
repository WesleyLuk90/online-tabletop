import { Layer } from "./Layer";

export class Scene {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly layers: Layer[],
        readonly gridSize: number
    ) {}
}
