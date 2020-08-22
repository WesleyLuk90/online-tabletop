import { Implementation } from "./Implementation";

export abstract class Implementations {
    constructor(readonly impl: Implementation<any, any>[]) {}
}
