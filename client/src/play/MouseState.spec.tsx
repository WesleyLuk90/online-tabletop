import { Buttons, MouseState } from "./MouseState";
import { Vector } from "./Viewport";

describe("MouseState", () => {
    it("should check if its a drag", () => {
        const now = jest.fn().mockReturnValue(10);
        const mouseState = new MouseState(
            null,
            Buttons.LEFT,
            {
                screen: new Vector(0, 0),
                world: new Vector(0, 0)
            },
            now
        );
        expect(mouseState.isDrag()).toBe(false);
        now.mockReturnValue(100000);
        expect(mouseState.isDrag()).toBe(true);
    });
});
