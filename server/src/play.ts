import { Server } from "http";
import { PathReporter } from "io-ts/lib/PathReporter";
import lodash from "lodash";
import { MessageValidator } from "protocol/lib/Messages";
import { Sequelize } from "sequelize/types";
import SocketIO from "socket.io";
import { PermissionError } from "./errors";
import { GameService } from "./games/GameService";
import { CampaignService } from "./play/CampaignService";
import { ConnectionManager } from "./play/ConnectionManager";
import { GameManager } from "./play/GameManager";
import { GameStorage } from "./play/GameStorage";
import { TokenManager } from "./play/TokenManager";
import { Context, Routes } from "./route";

export async function initializePlay(
    httpServer: Server,
    gameService: GameService,
    db: Sequelize
): Promise<Routes> {
    const io = SocketIO(httpServer, {
        path: "/socket/play",
        serveClient: false
    });

    const tokenManager = new TokenManager();
    const campaignService = await CampaignService.create(db);
    const gameStorage = new GameStorage(campaignService);
    const gameManager = new GameManager(gameStorage);
    const connectionManager = await ConnectionManager.create(
        tokenManager,
        gameManager
    );

    async function withErrorReporting(callable: () => Promise<void>) {
        try {
            await callable();
        } catch (e) {
            console.error("Unexpected error", e);
        }
    }

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
            withErrorReporting(() => handler.onHandshake({ token }));
        });
        socket.on("game.message", (message: any) => {
            const parsed = MessageValidator.decode(message);
            if (parsed.isLeft()) {
                const errors = JSON.stringify(PathReporter.report(parsed));
                withErrorReporting(() =>
                    handler.onError(`Error parsing client message ${errors}`)
                );
            }
            parsed.map(mes => {
                withErrorReporting(() => handler.onMessage(mes));
            });
        });
        socket.on("disconnect", () => {
            withErrorReporting(() => handler.onDisconnected());
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
