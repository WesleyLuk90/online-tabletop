import { Token } from "protocol/src/Token";
import { keyBy } from "../../util/Maps";

export interface TokenUpdate {
    campaignID: string;
    tokenID: string;
    updatedFields: Partial<Token>;
}

export class TokenUpdater {
    static apply(tokens: Token[], updates: TokenUpdate[]): Token[] {
        const updatesByToken = keyBy(updates, u => u.tokenID);
        return tokens.map(t => {
            if (updatesByToken.has(t.tokenID)) {
                return {
                    ...t,
                    ...updatesByToken.get(t.tokenID)?.updatedFields
                };
            } else {
                return t;
            }
        });
    }
}
