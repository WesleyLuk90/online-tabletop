import { lazy } from "../src/Module";

describe("Module", () => {
    it("should lazy compute", () => {
        const mock = jest.fn().mockReturnValue(1);
        const value = lazy(mock);
        expect(value()).toBe(1);
        expect(value()).toBe(1);
        expect(mock).toHaveBeenCalledTimes(1);
    });

    it("should error if recursive", () => {
        const compute = (): number => value();
        const value = lazy(compute);
        expect(value).toThrow("Circular dependency");
    });
});
