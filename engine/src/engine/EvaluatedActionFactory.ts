import { Either } from "fp-ts/lib/Either";
import { rightOrThrow } from "../utils/Exceptions";
import { PreparedAction } from "./models/PreparedAction";

export class EvaluatedAction {}

type EvaluationError = never;

export class EvaluatedActionFactory {
    static createChecked(preparedAction: PreparedAction): EvaluatedAction {
        return rightOrThrow(EvaluatedActionFactory.create(preparedAction));
    }

    static create(
        preparedAction: PreparedAction
    ): Either<EvaluatedAction, EvaluationError> {
        throw "nope";
    }
}
