import { iots } from "./iots";

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

export const RollLiteralDataSchema = iots.strict({
    _tag: iots.literal("literal"),
    value: iots.number,
});

export const RollExpressionDataSchema = iots.strict({
    expression: iots.union([
        RollFunctionDataSchema,
        RollVariableDataSchema,
        RollLiteralDataSchema,
    ]),
});

export interface RollExpressionData
    extends iots.TypeOf<typeof RollExpressionDataSchema> {}
