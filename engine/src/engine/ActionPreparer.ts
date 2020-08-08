import { Either, right } from "fp-ts/lib/Either";
import { BaseError } from "../BaseError";
import { Campaign } from "./models/Campaign";
import { PreparedAction } from "./models/PreparedAction";
import { ActionReference } from "./models/Reference";

export class ActionPreparer {
    private constructor(
        private campaign: Campaign,
        private action: ActionReference
    ) {}

    prepare(): Either<PreparedAction, BaseError> {
        return right(new PreparedAction());
    }
}
