import {
    EvaluatedExpressionFactory,
    EvaluatedFunction,
    EvaluatedLiteral,
    EvaluatedVariable,
} from "../../src/engine/EvaluatedExpressionFactory";
import {
    ResolvedExpression,
    ResolvedValues,
} from "../../src/engine/ExpressionResolver";
import {
    ComputedAttribute,
    NumberAttribute,
} from "../../src/engine/models/Attribute";
import { RollParser } from "../../src/engine/rolls/RollParser";

describe("EvaluatedExpressionFactory", () => {
    it("should simple", () => {
        expect(
            EvaluatedExpressionFactory.createChecked(
                new ResolvedExpression(
                    RollParser.parseChecked("str"),
                    ResolvedValues.create(new NumberAttribute("str", 10))
                )
            )
        ).toEqual(new EvaluatedVariable(10, "str", new EvaluatedLiteral(10)));
    });
    it("should evaluate functions", () => {
        expect(
            EvaluatedExpressionFactory.createChecked(
                new ResolvedExpression(
                    RollParser.parseChecked("str_mod"),
                    ResolvedValues.create(
                        new NumberAttribute("str", 17),
                        new ComputedAttribute(
                            "str_mod",
                            RollParser.parseChecked("floor((str - 10) / 2)")
                        )
                    )
                )
            )
        ).toEqual(
            new EvaluatedVariable(
                3,
                "str_mod",
                new EvaluatedFunction(3, "floor", [
                    new EvaluatedFunction(3.5, "div", [
                        new EvaluatedFunction(7, "sub", [
                            new EvaluatedVariable(
                                17,
                                "str",
                                new EvaluatedLiteral(17)
                            ),
                            new EvaluatedLiteral(10),
                        ]),
                        new EvaluatedLiteral(2),
                    ]),
                ])
            )
        );
    });
});
