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
    });

    xit("should parse", () => {
        expect(RollParser.parse("1+3d4+floor(str/2)")).toEqual(
            new RollFunction("sum", [
                new RollLiteral(1),
                new RollFunction("sum", [
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
