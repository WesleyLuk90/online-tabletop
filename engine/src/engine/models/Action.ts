import { RollExpression } from "./RollDefinition";

export class Action {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly description: string,
        readonly rollExpression: RollExpression
    ) {}
}
