import { Token } from "protocol/src/Token";

export class TokenSelection {
    static empty() {
        return new TokenSelection([]);
    }

    private set: Set<string>;

    constructor(tokens: Iterable<string>) {
        this.set = new Set(tokens);
    }

    has(token: Token) {
        return this.set.has(token.tokenID);
    }

    add(tokens: Token[]) {
        const next = new TokenSelection(this.set);
        tokens.forEach(t => next.set.add(t.tokenID));
        return next;
    }

    asList(): string[] {
        return Array.from(this.set);
    }
}
