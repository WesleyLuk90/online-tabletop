import { Color } from "../../utils/Color";

export class Layer {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly color: Color,
        readonly playerVisible: boolean
    ) {}
}
