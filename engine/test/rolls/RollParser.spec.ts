import { left } from "fp-ts/lib/Either";
import {
    RollFunction,
    RollLiteral,
    RollVariable,
} from "../../src/engine/models/RollDefinition";
import { RollParser } from "../../src/engine/rolls/RollParser";

describe("RollParser", () => {
    it("should parse simple", () => {
        expect(RollParser.parseChecked("1+3")).toEqual(
            new RollFunction("add", [new RollLiteral(1), new RollLiteral(3)])
        );
        expect(RollParser.parseChecked("1-3")).toEqual(
            new RollFunction("sub", [new RollLiteral(1), new RollLiteral(3)])
        );
        expect(RollParser.parseChecked("1*3")).toEqual(
            new RollFunction("mul", [new RollLiteral(1), new RollLiteral(3)])
        );
        expect(RollParser.parseChecked("1/3")).toEqual(
            new RollFunction("div", [new RollLiteral(1), new RollLiteral(3)])
        );
        expect(RollParser.parseChecked("floor(10)")).toEqual(
            new RollFunction("floor", [new RollLiteral(10)])
        );
    });

    it("should handle unary operators", () => {
        expect(RollParser.parseChecked("-1")).toEqual(
            new RollFunction("neg", [new RollLiteral(1)])
        );
        expect(RollParser.parseChecked("1---1")).toEqual(
            new RollFunction("sub", [
                new RollLiteral(1),
                new RollFunction("neg", [
                    new RollFunction("neg", [new RollLiteral(1)]),
                ]),
            ])
        );
        expect(RollParser.parseChecked("-1*3")).toEqual(
            new RollFunction("mul", [
                new RollFunction("neg", [new RollLiteral(1)]),
                new RollLiteral(3),
            ])
        );
    });

    it("should parse order of operations", () => {
        expect(RollParser.parseChecked("1+2-3*4/5")).toEqual(
            new RollFunction("add", [
                new RollLiteral(1),
                new RollFunction("sub", [
                    new RollLiteral(2),
                    new RollFunction("mul", [
                        new RollLiteral(3),
                        new RollFunction("div", [
                            new RollLiteral(4),
                            new RollLiteral(5),
                        ]),
                    ]),
                ]),
            ])
        );
        expect(RollParser.parseChecked("1/2+3*4")).toEqual(
            new RollFunction("add", [
                new RollFunction("div", [
                    new RollLiteral(1),
                    new RollLiteral(2),
                ]),
                new RollFunction("mul", [
                    new RollLiteral(3),
                    new RollLiteral(4),
                ]),
            ])
        );
    });
    it("should handle parenthesis", () => {
        expect(RollParser.parseChecked("1*(2+3)/4")).toEqual(
            new RollFunction("mul", [
                new RollLiteral(1),
                new RollFunction("div", [
                    new RollFunction("add", [
                        new RollLiteral(2),
                        new RollLiteral(3),
                    ]),
                    new RollLiteral(4),
                ]),
            ])
        );
    });

    it("should multi args", () => {
        expect(RollParser.parseChecked("min(1, 2, 3)")).toEqual(
            new RollFunction("min", [
                new RollLiteral(1),
                new RollLiteral(2),
                new RollLiteral(3),
            ])
        );
    });

    it("should parse", () => {
        expect(RollParser.parseChecked("1+3d4+floor(str/2)")).toEqual(
            new RollFunction("add", [
                new RollLiteral(1),
                new RollFunction("add", [
                    new RollFunction("roll", [
                        new RollLiteral(3),
                        new RollLiteral(4),
                    ]),
                    new RollFunction("floor", [
                        new RollFunction("div", [
                            new RollVariable("str"),
                            new RollLiteral(2),
                        ]),
                    ]),
                ]),
            ])
        );
    });

    it("should fail", () => {
        [
            "1+min(1,,2)+2",
            "1,2",
            "1+*2",
            "1.1d2.2",
            "[1,2,3]",
            "(1",
            "2)",
            "max(1,2))",
            "+1",
            "10-",
            "10*",
        ].forEach((e) =>
            expect(RollParser.parse(e)).toEqual(left(expect.anything()))
        );
    });
});
