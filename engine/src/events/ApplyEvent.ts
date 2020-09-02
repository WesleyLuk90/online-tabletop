import { Campaign } from "../engine/models/Campaign";
import { iots } from "../schemas/iots";
import { renameCampaign, updatePlayer } from "./CampaignEvents";
import { Event, EventMappingSchema } from "./Event";

const Appliers: {
    [Key in keyof typeof EventMappingSchema]: (
        campaign: Campaign,
        event: iots.TypeOf<typeof EventMappingSchema[Key]>
    ) => Campaign;
} = {
    renameCampaign,
    updatePlayer,
};

export function applyEvent(campaign: Campaign, event: Event): Campaign {
    const key = Object.keys(event.event).filter(
        (key) => (event.event as any)[key] != null
    )[0] as keyof Event["event"];
    if (key == null) {
        return campaign;
    }
    const value = event.event[key];
    const applier = Appliers[key];
    return applier(campaign, value as any);
}
