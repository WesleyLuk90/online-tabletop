import { Campaign } from "../../../client/src/play/protocol/Campaign";
import { newId } from "../../../client/src/play/protocol/Id";
import { Message } from "../../../client/src/play/protocol/Messages";
import { Connection } from "./ConnectionManager";
import { Player } from "./Player";
export class Game {
    players: Player[] = [];
    campaign: Campaign = {
        id: "c1",
        scenes: [
            {
                id: "s1",
                name: "First Scene",
                tokens: [{ id: "t1", width: 70, height: 70, x: 0, y: 0 }]
            }
        ]
    };

    constructor(readonly id: string) {}

    join(userId: string, connection: Connection) {
        this.players.push(new Player(userId, newId(), connection));
        this.broadcastUpdatePlayers();
        connection.send({
            type: "update-campaign",
            id: newId(),
            campaign: this.campaign
        });
    }

    leave(connection: Connection) {
        this.players = this.players.filter(p => p.connection !== connection);
        this.broadcastUpdatePlayers();
    }

    private broadcast(message: Message) {
        this.players.forEach(p => p.connection.send(message));
    }

    private broadcastUpdatePlayers() {
        this.broadcast({
            type: "update-players",
            id: newId(),
            players: this.players.map(p => p.name)
        });
    }
}
