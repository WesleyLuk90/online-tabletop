import { parse } from "protocol/src/Parse";
import { campaignTopic, Update, UpdateSchema } from "protocol/src/Update";
import { connect } from "socket.io-client";

export class Socket {
    socket: SocketIOClient.Socket;

    constructor(
        readonly onConnect: () => void,
        readonly onUpdate: (update: Update) => void,
        readonly onDisconnect: () => void,
        readonly campaignID: string
    ) {
        this.socket = connect({
            path: "/socket/play"
        });
        this.socket.on("connect", this.onConnect);
        this.socket.on(campaignTopic(campaignID), (data: any) => {
            try {
                const result = parse(data, UpdateSchema);
                this.onUpdate(result);
            } catch (e) {
                console.error(e);
            }
        });
        this.socket.on("disconnect", () => {
            console.error("Disconnected");
            this.onDisconnect();
        });
    }
}