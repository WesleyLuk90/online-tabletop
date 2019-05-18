import { Campaign } from "../../../client/src/play/protocol/Campaign";
import { Scene } from "../../../client/src/play/protocol/Scene";
import { Token } from "../../../client/src/play/protocol/Token";

export function comparableScene(scene: Scene): Partial<Scene> {
    return {
        ...scene,
        tokens: null
    };
}

export function comparableToken(token: Token): Partial<Token> {
    return token;
}

export function comparableCampaign(campaign: Campaign): Partial<Campaign> {
    return {
        ...campaign,
        scenes: null
    };
}
