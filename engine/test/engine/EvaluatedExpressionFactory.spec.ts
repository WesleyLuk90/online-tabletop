import { EvaluatedExpressionFactory } from "../../src/engine/EvaluatedExpressionFactory";
import {
    ResolvedExpression,
    ResolvedValues,
} from "../../src/engine/ExpressionResolver";
import { NumberAttribute } from "../../src/engine/models/Attribute";
import { RollParser } from "../../src/engine/rolls/RollParser";

describe("EvaluatedExpressionFactory", () => {
    it("should create", () => {
        EvaluatedExpressionFactory.create(
            new ResolvedExpression(
                RollParser.parseChecked("str"),
                ResolvedValues.create(new NumberAttribute("str", 10))
            )
        );
    });
});
