import lodash from "lodash";
import { Campaign } from "../../../client/src/play/protocol/Campaign";
import { Scene } from "../../../client/src/play/protocol/Scene";
import { Token } from "../../../client/src/play/protocol/Token";

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
