import { Layer } from "engine/engine/models/Scene";
import { Token } from "engine/engine/models/Token";
import { groupBy, keyBy } from "../../util/Maps";

export class TokenCollection {
    static empty() {
        return new TokenCollection([]);
    }

    static fromList(tokens: Token[]) {
        return new TokenCollection(tokens);
    }

    private tokensByLayer: Map<string, Token[]>;
    private tokensById: Map<string, Token>;
    constructor(tokens: Token[]) {
        this.tokensByLayer = groupBy(tokens, (t) => t.layerID);
        this.tokensById = keyBy(tokens, (t) => t.tokenID);
    }

    byLayer(layer: Layer): Token[] {
        return this.tokensByLayer.get(layer.id) || [];
    }

    byId(id: string): Token | null {
        return this.tokensById.get(id) || null;
    }

    has(tokenID: string) {
        return this.byId(tokenID) != null;
    }

    update(token: Token) {
        const byId = new Map(this.tokensById);
        byId.set(token.tokenID, token);
        return TokenCollection.fromList(Array.from(byId.values()));
    }

    remove(tokenID: string) {
        const byId = new Map(this.tokensById);
        byId.delete(tokenID);
        return TokenCollection.fromList(Array.from(byId.values()));
    }

    asList() {
        return Array.from(this.tokensById.values());
    }
}
