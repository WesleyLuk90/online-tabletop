import { Campaign } from "protocol/src/Campaign";
import { User } from "protocol/src/User";

export class EventHandler {
    constructor(private campaign: Campaign, private user: User) {}

    changeMyScene(sceneID: string) {
        const newCampaign = {
            ...this.campaign,
            players: this.campaign.players.map(p => {
                if (p.userID === this.user.id) {
                    return { ...p, sceneID: sceneID };
                } else {
                    return p;
                }
            })
        };
    }
}
