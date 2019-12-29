import { Server } from "http";
import { campaignUpdate, Update } from "protocol/src/Update";
import SocketIO from "socket.io";

export class BroadcastService {
    socket: SocketIO.Server;
    constructor(httpServer: Server) {
        this.socket = SocketIO(httpServer, {
            path: "/socket/play",
            serveClient: false
        });
    }

    broadcast(update: Update) {
        this.socket.emit(campaignUpdate(update.campaignID), update);
    }
}
