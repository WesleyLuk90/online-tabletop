import {
    RollFunction,
    RollLiteral,
    RollVariable,
} from "../../src/engine/models/RollDefinition";
import { RollParser } from "../../src/engine/rolls/RollParser";

describe("RollParser", () => {
    it("should parse simple", () => {
        expect(RollParser.parse("1+3")).toEqual(
            new RollFunction("add", [new RollLiteral(1), new RollLiteral(3)])
        );
        expect(RollParser.parse("1-3")).toEqual(
            new RollFunction("sub", [new RollLiteral(1), new RollLiteral(3)])
        );
        expect(RollParser.parse("1*3")).toEqual(
            new RollFunction("mul", [new RollLiteral(1), new RollLiteral(3)])
        );
        expect(RollParser.parse("1/3")).toEqual(
            new RollFunction("div", [new RollLiteral(1), new RollLiteral(3)])
        );
        expect(RollParser.parse("floor(10)")).toEqual(
            new RollFunction("floor", [new RollLiteral(10)])
        );
    });

    it("should parse order of operations", () => {
        expect(RollParser.parse("1+2-3*4/5")).toEqual(
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
        expect(RollParser.parse("1/2+3*4")).toEqual(
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
        expect(RollParser.parse("1*(2+3)/4")).toEqual(
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

    it("should parse", () => {
        expect(RollParser.parse("1+3d4+floor(str/2)")).toEqual(
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
});
