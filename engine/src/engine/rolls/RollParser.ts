import { RollExpression } from "../models/RollDefinition";
import { Tokenizer } from "./Tokenizer";

export class RollParser {
    static parse(expression: string): RollExpression {
        console.log(Tokenizer.tokenize(expression));
        throw Error("wat");
    }
}
