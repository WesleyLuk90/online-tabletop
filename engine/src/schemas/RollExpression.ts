import {
    RollExpression,
    RollFunction,
    RollLiteral,
    RollVariable
} from "../engine/models/RollDefinition";
import { assertExaustive } from "../utils/Exaustive";
import { iots } from "./iots";
import { Serde } from "./Serde";

export const RollFunctionDataSchema: iots.Type<RollFunctionData> = iots.recursion(
    "RollFunctionDataSchema",
    () =>
        iots.strict({
            _tag: iots.literal("function"),
            functionName: iots.string,
            args: iots.array(RollExpressionDataSchema),
        })
);

export interface RollFunctionData {
    _tag: "function";
    functionName: string;
    args: RollExpressionData[];
}

export const RollVariableDataSchema = iots.strict({
    _tag: iots.literal("variable"),
    variableName: iots.string,
});
export interface RollVariableData
    extends iots.TypeOf<typeof RollVariableDataSchema> {}

export const RollLiteralDataSchema = iots.strict({
    _tag: iots.literal("literal"),
    value: iots.number,
});

export interface RollLiteralData
    extends iots.TypeOf<typeof RollLiteralDataSchema> {}

export const RollExpressionDataSchema: iots.Type<RollExpressionData> = iots.recursion("RollExpressionDataSchema", () => iots.strict(
    {
        expression: iots.union([
            RollFunctionDataSchema,
            RollVariableDataSchema,
            RollLiteralDataSchema,
        ]),
    }
);

export interface RollExpressionData {
    expression: RollFunctionData | RollVariableData | RollLiteralData;
}

export const RollExpressionSerde: Serde<
    RollExpression,
    RollExpressionData
> = new Serde<RollExpression, RollExpressionData>(
    (roll) => {
        if (roll instanceof RollFunction) {
            return {
                expression: {
                    _tag: "function",
                    functionName: roll.functionName,
                    args: roll.args.map(RollExpressionSerde.serialize),
                },
            };
        } else if (roll instanceof RollVariable) {
            return {
                expression: {
                    _tag: "variable",
                    variableName: roll.variableName,
                },
            };
        } else if (roll instanceof RollLiteral) {
            return {
                expression: {
                    _tag: "literal",
                    value: roll.value,
                },
            };
        } else {
            assertExaustive(roll);
        }
    },
    (data) => {
        const e = data.expression;
        switch (e._tag) {
            case "function":
                return new RollFunction(
                    e.functionName,
                    e.args.map(RollExpressionSerde.deserialize)
                );
            case "variable":
                return new RollVariable(e.variableName);
            case "literal":
                return new RollLiteral(e.value);
            default:
                assertExaustive(e);
        }
    }
);
