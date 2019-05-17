import { Campaign } from "./Campaign";
import { Message, UpdateToken } from "./Messages";
import { Scene } from "./Scene";

function updateList<T>(
    objects: T[],
    condition: (object: T) => boolean,
    updater: (object: T) => T
) {
    const object = objects.find(condition);
    if (object === null) {
        console.error(`No objects updated`);
        return objects;
    }
    return objects.map(object => {
        if (condition(object)) {
            return updater(object);
        } else {
            return object;
        }
    });
}

function upsertList<T>(
    objects: T[],
    newObject: T,
    condition: (matching: T) => boolean
) {
    const match = objects.find(condition);
    if (match == null) {
        return [...objects, newObject];
    }
    return objects.map(object => {
        if (condition(object)) {
            return newObject;
        } else {
            return object;
        }
    });
}

export class Updaters {
    static update(campaign: Campaign, message: Message): Campaign | null {
        switch (message.type) {
            case "update-campaign":
                return message.campaign;
            case "update-token":
                return Updaters.updateToken(campaign, message);
            default:
                return null;
        }
    }

    static updateScene(
        campaign: Campaign,
        sceneId: string,
        updater: (scene: Scene) => Scene
    ) {
        return {
            ...campaign,
            scenes: updateList(campaign.scenes, s => s.id === sceneId, updater)
        };
    }

    static updateToken(campaign: Campaign, updateToken: UpdateToken): Campaign {
        return Updaters.updateScene(campaign, updateToken.sceneId, scene => ({
            ...scene,
            tokens: upsertList(
                scene.tokens,
                updateToken.token,
                t => t.id === updateToken.token.id
            )
        }));
    }
}
