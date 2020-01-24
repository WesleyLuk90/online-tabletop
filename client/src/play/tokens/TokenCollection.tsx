import { Layer } from "protocol/src/Scene";
import { Token } from "protocol/src/Token";
import { groupBy, keyBy } from "../../util/Maps";

export class TokenCollection {
    private tokensByLayer: Map<string, Token[]>;
    private tokensById: Map<string, Token>;
    constructor(tokens: Token[]) {
        this.tokensByLayer = groupBy(tokens, t => t.layerID);
        this.tokensById = keyBy(tokens, t => t.tokenID);
    }

    byLayer(layer: Layer): Token[] {
        return this.tokensByLayer.get(layer.id) || [];
    }

    byId(id: string): Token | null {
        return this.tokensById.get(id) || null;
    }
}
