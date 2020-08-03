import {
    RollFunction,
    RollLiteral,
    RollVariable,
} from "../../src/engine/models/RollDefinition";
import { RollParser } from "../../src/engine/rolls/RollParser";

describe("RollParser", () => {
    it("should parse", () => {
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
