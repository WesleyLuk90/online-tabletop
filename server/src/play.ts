import { Server } from "http";
import SocketIO from "socket.io";

export function initializePlay(httpServer: Server) {
    const io = SocketIO(httpServer, {
        path: "/socket/play",
        serveClient: false
    });

    io.on("connection", socket => {
        console.log("socket connected");
        console.log(socket);
        socket.send("message", { hello: "world" });
    });
}
