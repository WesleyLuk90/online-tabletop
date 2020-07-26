import Ajv from "ajv";
import { BaseError } from "./BaseError";
import { CampaignData } from "./generated/types";

export class ParseValidationError extends BaseError {
    constructor(readonly errors: Ajv.ErrorObject[], readonly message: string) {
        super(message);
    }
}

class Schema<T> {
    constructor(readonly schema: object) {}

    parse(data: any): T {
        const validator = new Ajv();
        const validate = validator.compile(this.schema);
        const result = validate(data);
        if (!result && validate.errors) {
            throw new ParseValidationError(
                validate.errors,
                "Failed to validate data schema"
            );
        }
        return data;
    }
}

export const CampaignSchema = new Schema<CampaignData>(
    require("../schemas/campaign.json")
);
