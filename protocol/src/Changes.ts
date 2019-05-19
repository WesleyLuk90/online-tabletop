import lodash from "lodash";
import { Campaign } from "./Campaign";
import { Scene } from "./Scene";
import { Token } from "./Token";

function onlyCampaign(campaign: Campaign): Partial<Campaign> {
    const copy = {
        ...campaign
    };
    delete copy.scenes;
    return copy;
}

function onlyScene(scene: Scene): Partial<Scene> {
    const copy = {
        ...scene
    };
    delete copy.tokens;
    return copy;
}

export function sceneChanged(scene: Scene, other: Scene) {
    return lodash.isEqual(onlyScene(scene), onlyScene(other));
}

export function tokenChanged(token: Token, other: Token) {
    return lodash.isEqual(token, other);
}

export function campaignChanged(campaign: Campaign, other: Campaign) {
    return lodash.isEqual(onlyCampaign(campaign), onlyCampaign(other));
}
