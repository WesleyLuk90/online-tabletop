import { Server } from "http";
import lodash from "lodash";
import SocketIO from "socket.io";
import { PermissionError } from "./errors";
import { GameService } from "./games/GameService";
import { TokenManager } from "./play/TokenManager";
import { Context, Routes } from "./route";

export function initializePlay(
    httpServer: Server,
    gameService: GameService
): Routes {
    const io = SocketIO(httpServer, {
        path: "/socket/play",
        serveClient: false
    });

    const tokenManager = new TokenManager();

    io.on("connection", socket => {
        socket.on("game.handshake", (message: string) => {
            console.log(message);
            const token = tokenManager.get(lodash.get(message, ["token"], ""));
            if (!token) {
                return socket.disconnect(true);
            }
            console.log("new connection from", token);
        });
    });
    return {
        "/api/play": {
            method: "get",
            async handle(context: Context<{}, { gameId: string }>) {
                const gameId = context.data.query.gameId || "";
                const permission = await gameService.getPermission(
                    gameId,
                    context.user_id
                );
                if (permission == null) {
                    throw new PermissionError();
                }
                const token = await tokenManager.create(
                    gameId,
                    context.user_id
                );
                return {
                    token: token.token
                };
            }
        }
    };
}
