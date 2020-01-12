import { Color } from "protocol/src/Color";

export class ColorService {
    static toRGBA(color: Color) {
        return `rgba(${color.red}, ${color.green}, ${
            color.blue
        }, ${color.alpha.toFixed(2)})`;
    }
}
