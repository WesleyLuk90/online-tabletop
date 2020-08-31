import { Color } from "../utils/Color";
import { iots } from "./iots";
import { Serde } from "./Serde";

export const ColorDataSchema = iots.strict({
    red: iots.number,
    green: iots.number,
    blue: iots.number,
    alpha: iots.number,
});
export interface ColorData extends iots.TypeOf<typeof ColorDataSchema> {}
export const ColorDataSerde: Serde<Color, ColorData> = {
    deserialize(data: ColorData): Color {
        return new Color(data.red, data.green, data.blue, data.alpha);
    },
    serialize(color: Color): ColorData {
        return {
            red: color.red,
            green: color.green,
            blue: color.blue,
            alpha: color.alpha,
        };
    },
};
