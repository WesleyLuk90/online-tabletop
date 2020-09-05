import { EventSchema } from "../events/Event";
import { iots, optional } from "../schemas/iots";
import { UserDataSchema } from "../schemas/UserData";
import { Api, ApiVoid } from "./Api";

export const GetCurrentUser = new Api(
    "getCurrentUser",
    ApiVoid,
    optional(UserDataSchema)
);

export const ListCampaigns = new Api(
    "listCampaigns",
    ApiVoid,
    iots.array(
        iots.strict({
            id: iots.string,
            name: iots.string,
        })
    )
);

export const CreateCampaign = new Api(
    "createCampaign",
    iots.strict({
        name: iots.string,
    }),
    ApiVoid
);

export const UpdateCampaign = new Api(
    "submitEvent",
    iots.strict({
        id: iots.string,
        update: EventSchema,
    }),
    ApiVoid
);
