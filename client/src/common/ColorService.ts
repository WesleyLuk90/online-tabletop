import { ColorData } from "engine/models/Color";
import { Color } from "../play/Colors";

export class ColorService {
    static toRGBA(color: ColorData) {
        return `rgba(${color.red}, ${color.green}, ${
            color.blue
        }, ${color.alpha.toFixed(2)})`;
    }

    static key(color: Color) {
        return ColorService.toRGBA(color);
    }

    static isEqual(a: ColorData, b: ColorData) {
        return (
            a.red === b.red &&
            a.green === b.green &&
            a.blue === b.blue &&
            a.alpha === b.alpha
        );
    }
}
