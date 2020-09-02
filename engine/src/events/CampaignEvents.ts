import { Campaign } from "../engine/models/Campaign";
import { PlayerDataSchema } from "../schemas/CampaignData";
import { iots } from "../schemas/iots";

export const RenameCampaignSchema = iots.strict({
    name: iots.string,
});
export interface RenameCampaign
    extends iots.TypeOf<typeof RenameCampaignSchema> {}

export function renameCampaign(
    campaign: Campaign,
    renameCampaign: RenameCampaign
) {
    return campaign.update({ name: renameCampaign.name });
}

export const UpdatePlayerSchema = iots.strict({
    player: PlayerDataSchema,
});
export interface UpdatePlayer extends iots.TypeOf<typeof UpdatePlayerSchema> {}

export function updatePlayer(campaign: Campaign, updatePlayer: UpdatePlayer) {
    return campaign.update({
        players: campaign.players.add(updatePlayer.player),
    });
}

export const DeletePlayerSchema = iots.strict({
    id: iots.string,
});
export interface DeletePlayer extends iots.TypeOf<typeof DeletePlayerSchema> {}
