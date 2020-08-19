import { Token } from "engine/engine/models/Token";
import { CreateToken, UpdateToken } from "engine/engine/models/TokenDelta";

export interface GameTokenUpdate {
    tokenID: string;
    updatedFields: Partial<Token>;
}

export class TokenDeltaFactory {
    constructor(private sessionID: string, private campaignID: string) {}

    create(token: Token): CreateToken {
        return {
            type: "create",
            token,
            source: this.sessionID,
        };
    }

    update(updates: GameTokenUpdate[]): UpdateToken[] {
        return updates.map((u) => ({
            type: "update",
            campaignID: this.campaignID,
            tokenID: u.tokenID,
            update: u.updatedFields,
            source: this.sessionID,
        }));
    }
}
