import { Color } from "./Color";

export class Layer {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly color: Color
    ) {}
}
