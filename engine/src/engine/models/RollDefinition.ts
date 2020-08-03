export class RollFunction {
    constructor(
        readonly functionName: string,
        readonly args: RollExpression[]
    ) {}
}

export class RollVariable {
    constructor(readonly variableName: string) {}
}

export class RollLiteral {
    constructor(readonly value: number) {}
}

export type RollExpression = RollFunction | RollVariable | RollLiteral;
