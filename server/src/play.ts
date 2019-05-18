import { Server } from "http";
import lodash from "lodash";
import { MessageValidator } from "protocol/lib/Messages";
import SocketIO from "socket.io";
import { PermissionError } from "./errors";
import { GameService } from "./games/GameService";
import { ConnectionManager } from "./play/ConnectionManager";
import { GameManager } from "./play/GameManager";
import { TokenManager } from "./play/TokenManager";
import { Context, Routes } from "./route";

export async function initializePlay(
    httpServer: Server,
    gameService: GameService
): Promise<Routes> {
    const io = SocketIO(httpServer, {
        path: "/socket/play",
        serveClient: false
    });

    const tokenManager = new TokenManager();
    const gameManager = new GameManager();
    const connectionManager = await ConnectionManager.create(
        tokenManager,
        gameManager
    );

    io.on("connection", socket => {
        const handler = connectionManager.newConnection({
            remoteAddress: socket.conn.remoteAddress,
            close() {
                socket.disconnect(true);
            },
            send(message) {
                socket.emit("game.message", message);
            }
        });
        socket.on("game.handshake", (handshake: any) => {
            let token = lodash.get(handshake, ["token"], "");
            if (typeof token !== "string") {
                token = "";
            }
            handler.onHandshake({ token });
        });
        socket.on("game.message", (message: any) => {
            const parsed = MessageValidator.decode(message);
            parsed.fold(
                e => {
                    handler.onError(e.toString());
                },
                mes => {
                    handler.onMessage(mes);
                }
            );
        });
        socket.on("disconnect", () => {
            handler.onDisconnected();
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
