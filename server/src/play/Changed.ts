import lodash from "lodash";
import { Campaign } from "protocol/lib/Campaign";
import { Scene } from "protocol/lib/Scene";
import { Token } from "protocol/lib/Token";

function comparableScene(scene: Scene): Partial<Scene> {
    return {
        ...scene,
        tokens: null
    };
}

function comparableToken(token: Token): Partial<Token> {
    return token;
}

function comparableCampaign(campaign: Campaign): Partial<Campaign> {
    return {
        ...campaign,
        scenes: null
    };
}

export function isSceneChanged(scene: Scene, other: Scene) {
    return !lodash.isEqual(comparableScene(scene), comparableScene(other));
}

export function isTokenChanged(token: Token, other: Token) {
    return !lodash.isEqual(comparableToken(token), comparableToken(other));
}

export function isCampaignChanged(campaign: Campaign, other: Campaign) {
    return !lodash.isEqual(
        comparableCampaign(campaign),
        comparableCampaign(other)
    );
}
