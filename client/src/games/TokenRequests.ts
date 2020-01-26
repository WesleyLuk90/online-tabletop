import Axios from "axios";
import { parse } from "protocol/src/Parse";
import { Token, TokenSchema } from "protocol/src/Token";
import {
    getCampaignID,
    TokenDelta,
    UpdateToken
} from "protocol/src/TokenDelta";
import { TokenUpdate } from "../play/tokens/TokenUpdater";

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

    static create(token: Token, source: string) {
        return this.sendDeltas([
            {
                type: "create",
                token,
                source
            }
        ]);
    }

    static update(updates: TokenUpdate[], source: string) {
        return this.sendDeltas(
            updates.map(u => {
                const update: UpdateToken = {
                    type: "update",
                    campaignID: u.campaignID,
                    tokenID: u.tokenID,
                    update: u.updatedFields,
                    source: source
                };
                return update;
            })
        );
    }

    static sendDeltas(deltas: TokenDelta[]) {
        return Axios.post(
            `/api/campaigns/${getCampaignID(deltas[0])}/tokens`,
            deltas
        );
    }
}
