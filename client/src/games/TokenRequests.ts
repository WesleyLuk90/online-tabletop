import Axios from "axios";
import { parse } from "protocol/src/Parse";
import { Token, TokenSchema } from "protocol/src/Token";
import {
    CreateToken,
    getCampaignID,
    TokenDelta,
    UpdateToken
} from "protocol/src/TokenDelta";

export class TokenRequests {
    static list({
        campaignID,
        sceneID
    }: {
        campaignID: string;
        sceneID: string;
    }): Promise<Token[]> {
        return Axios.get(
            `/api/campaigns/${campaignID}/scenes/${sceneID}/tokens`
        ).then(res => {
            const data: any[] = res.data;
            return data.map(d => parse(d, TokenSchema));
        });
    }

    static create(createTokenDelta: CreateToken) {
        return this.sendDeltas([createTokenDelta]);
    }

    static update(updates: UpdateToken[]) {
        return this.sendDeltas(updates);
    }

    private static sendDeltas(deltas: TokenDelta[]) {
        return Axios.post(
            `/api/campaigns/${getCampaignID(deltas[0])}/tokens`,
            deltas
        );
    }
}
