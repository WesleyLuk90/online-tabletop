import { Either, isLeft } from "fp-ts/lib/Either";
import { Campaign } from "./models/Campaign";
import { PreparedAction } from "./models/PreparedAction";
import { ActionReference } from "./models/Reference";
import { References, ResolutionError } from "./References";

type PrepareError = ResolutionError;

export class PreparedActionFactory {
    static createChecked(action: ActionReference, campaign: Campaign) {
        return new PreparedActionFactory(action, campaign).create();
    }

    static create(action: ActionReference, campaign: Campaign) {
        return new PreparedActionFactory(action, campaign).create();
    }

    private constructor(
        private action: ActionReference,
        private campaign: Campaign
    ) {}

    create(): Either<PrepareError, PreparedAction> {
        const entities = References.resolve(this.action.entity, this.campaign);
        if (isLeft(entities)) {
            return entities;
        }
        throw Error();
    }
}
