import { Color } from "engine/utils/Color";

export class ColorService {
    static toRGBA(color: Color) {
        return `rgba(${color.red}, ${color.green}, ${
            color.blue
        }, ${color.alpha.toFixed(2)})`;
    }

    static key(color: Color) {
        return ColorService.toRGBA(color);
    }

    static isEqual(a: Color, b: Color) {
        return (
            a.red === b.red &&
            a.green === b.green &&
            a.blue === b.blue &&
            a.alpha === b.alpha
        );
    }
}
