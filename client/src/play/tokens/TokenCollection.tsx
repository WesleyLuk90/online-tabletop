import { Layer } from "protocol/src/Scene";
import { Token } from "protocol/src/Token";
import { groupBy } from "../../util/Maps";

export class TokenCollection {
    private byLayer: Map<string, Token[]>;
    constructor(tokens: Token[]) {
        this.byLayer = groupBy(tokens, t => t.layerID);
    }

    get(layer: Layer): Token[] {
        return this.byLayer.get(layer.id) || [];
    }
}
