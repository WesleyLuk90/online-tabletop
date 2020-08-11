import { fromNullable, Option } from "fp-ts/lib/Option";
import { lazy } from "../utils/Lazy";
import { Random } from "../utils/Random";

export class Range {
    constructor(readonly min: number | null, readonly max: number | null) {}

    contains(number: number) {
        if (this.min != null && number < this.min) {
            return false;
        }
        if (this.max != null && number > this.max) {
            return false;
        }
        return true;
    }

    toString() {
        if (this.min == null && this.max == null) {
            return "any number";
        } else if (this.min === this.max) {
            return `${this.min}`;
        } else if (this.min != null && this.max != null) {
            return `${this.min} to ${this.max}`;
        } else if (this.min != null) {
            return `at least ${this.min}`;
        } else if (this.max != null) {
            return `at most ${this.max}`;
        }
        throw new Error();
    }
}

class RollFunction {
    constructor(
        readonly name: string,
        readonly range: Range,
        readonly evaluate: (args: number[]) => number
    ) {}
}

export const RollFunctions = [
    new RollFunction("add", new Range(0, null), (numbers) =>
        numbers.reduce((a, b) => a + b, 0)
    ),
    new RollFunction(
        "sub",
        new Range(2, 2),
        (numbers) => numbers[0] - numbers[1]
    ),
    new RollFunction(
        "mul",
        new Range(2, 2),
        (numbers) => numbers[0] * numbers[1]
    ),
    new RollFunction(
        "div",
        new Range(2, 2),
        (numbers) => numbers[0] / numbers[1]
    ),
    new RollFunction(
        "neg",
        new Range(1, 1),
        (numbers) => numbers[0] / numbers[1]
    ),
    new RollFunction("min", new Range(1, null), (numbers) =>
        Math.min(...numbers)
    ),
    new RollFunction("max", new Range(1, null), (numbers) =>
        Math.max(...numbers)
    ),
    new RollFunction("floor", new Range(1, 1), (numbers) =>
        Math.floor(numbers[0])
    ),
    new RollFunction("ceil", new Range(1, 1), (numbers) =>
        Math.ceil(numbers[0])
    ),
    new RollFunction("roll", new Range(2, 2), (numbers) => {
        let sum = 0;
        for (let i = 0; i < numbers[1]; i++) {
            sum += Random.randomDice(numbers[1]);
        }
        return sum;
    }),
];

const byID = lazy(() => new Map(RollFunctions.map((f) => [f.name, f])));

export function getRollFunction(name: string): Option<RollFunction> {
    return fromNullable(byID().get(name));
}
