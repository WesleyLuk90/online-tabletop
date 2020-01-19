import Axios from "axios";
import { parse } from "protocol/src/Parse";
import { Token, TokenSchema } from "protocol/src/Token";
import { getCampaignID, TokenDelta } from "protocol/src/TokenDelta";

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

    static update(delta: TokenDelta) {
        return Axios.post(
            `/api/campaigns/${getCampaignID(delta)}/tokens`,
            delta
        );
    }
}