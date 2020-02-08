import { Color, Colors } from "../Colors";
import { TokenUpdater } from "./TokenUpdater";

describe("TokenUpdater", () => {
    it("should update", () => {
        const updated = TokenUpdater.apply(
            [
                {
                    campaignID: "1",
                    tokenID: "2",
                    sceneID: "3",
                    x: 1,
                    y: 1,
                    width: 1,
                    height: 1,
                    layerID: "",
                    version: 0,
                    data: {
                        type: "square",
                        strokeColor: Colors[0],
                        strokeWidth: 3,
                        fillColor: new Color(10, 10, 10, 0.1)
                    }
                }
            ],
            [
                {
                    campaignID: "1",
                    tokenID: "2",
                    updatedFields: { x: 4 }
                }
            ]
        );
        expect(updated).toHaveLength(1);
        expect(updated[0].x).toBe(4);
    });
});
