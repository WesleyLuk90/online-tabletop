import { PreparedAction } from "../../src/engine/models/PreparedAction";

describe("EvaluatedActionFactory", () => {
    it("should create", () => {
        EvaluatedActionFactory.create(new PreparedAction());
    });
});
