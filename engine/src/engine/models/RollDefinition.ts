export class RollFunction {
    constructor(
        readonly functionName: string,
        readonly args: RollExpression[]
    ) {}

    toString(): string {
        return `${this.functionName}(${this.args
            .map((t) => t.toString())
            .join(", ")})`;
    }
}

export class RollVariable {
    constructor(readonly variableName: string) {}
    toString() {
        return `${this.variableName}`;
    }
}

export class RollLiteral {
    constructor(readonly value: number) {}
    toString() {
        return `${this.value}`;
    }
}

export type RollExpression = RollFunction | RollVariable | RollLiteral;
