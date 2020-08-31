import { RollParser } from "../../src/engine/rolls/RollParser";
import { RollExpressionSerde } from "..//../src/schemas/RollExpression";
describe("RollExpressionSerde", () => {
    it("should serialize", () => {
        const expression = RollParser.parseChecked("floor(1 + str)");

        expect(
            RollExpressionSerde.deserialize(
                RollExpressionSerde.serialize(expression)
            )
        ).toEqual(expression);
    });
});
