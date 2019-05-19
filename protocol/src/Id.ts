import { randomBytes } from "crypto";

const HEX_LOOKUP: Array<string> = [];

for (var i = 0; i < 256; i++) {
    HEX_LOOKUP[i] = (i < 16 ? "0" : "") + i.toString(16);
}
export function newId() {
    var r = randomBytes(16);

    r[6] = (r[6] & 0x0f) | 0x40;
    r[8] = (r[8] & 0x3f) | 0x80;

    return (
        HEX_LOOKUP[r[0]] +
        HEX_LOOKUP[r[1]] +
        HEX_LOOKUP[r[2]] +
        HEX_LOOKUP[r[3]] +
        "-" +
        HEX_LOOKUP[r[4]] +
        HEX_LOOKUP[r[5]] +
        "-" +
        HEX_LOOKUP[r[6]] +
        HEX_LOOKUP[r[7]] +
        "-" +
        HEX_LOOKUP[r[8]] +
        HEX_LOOKUP[r[9]] +
        "-" +
        HEX_LOOKUP[r[10]] +
        HEX_LOOKUP[r[11]] +
        HEX_LOOKUP[r[12]] +
        HEX_LOOKUP[r[13]] +
        HEX_LOOKUP[r[14]] +
        HEX_LOOKUP[r[15]]
    );
}
