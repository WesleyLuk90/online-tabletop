import { iots } from "../schemas/iots";
import { RenameCampaignSchema, UpdatePlayerSchema } from "./CampaignEvents";

export const EventMappingSchema = {
    renameCampaign: RenameCampaignSchema,
    updatePlayer: UpdatePlayerSchema,
};

export const EventSchema = iots.strict({
    campaign: iots.string,
    event: iots.partial(EventMappingSchema),
});

export interface Event extends iots.TypeOf<typeof EventSchema> {}
