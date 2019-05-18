import { Campaign } from "protocol/lib/Campaign";
import { Scene } from "protocol/lib/Scene";
import { Token } from "protocol/lib/Token";

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
