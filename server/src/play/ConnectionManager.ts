import { Message } from "protocol/lib/Messages";
import { Game } from "./Game";
import { GameManager } from "./GameManager";
import { TokenManager } from "./TokenManager";

interface Handshake {
    token: string;
}

export interface Connection {
    remoteAddress: string;
    send(message: Message): void;
    close(): void;
}

interface ConnectionMessageHandler {
    onHandshake(handshake: Handshake): void;
    onMessage(message: Message): void;
    onError(reason: string): void;
    onDisconnected(): void;
}

enum States {
    NEW = "NEW",
    CLOSED = "CLOSED"
}

interface PlayingState {
    game: Game;
}

type ConnectionState = States | PlayingState;

export class ConnectionManager {
    static async create(tokenManager: TokenManager, gameManager: GameManager) {
        return new ConnectionManager(tokenManager, gameManager);
    }

    constructor(
        private tokenManager: TokenManager,
        private gameManager: GameManager
    ) {}

    newConnection(connection: Connection): ConnectionMessageHandler {
        console.log(`New connection from ${connection.remoteAddress}`);
        let state: ConnectionState = States.NEW;

        function close() {
            connection.close();
            state = States.CLOSED;
        }

        return {
            onHandshake: async handshake => {
                if (state !== States.NEW) {
                    console.error(`Got handshake but state was ${state}`);
                    return close();
                }
                const token = this.tokenManager.get(handshake.token);
                if (token == null) {
                    console.error(`Invalid token '${handshake.token}'`);
                    return close();
                }
                const game = await this.gameManager.getGame(token.gameId);
                game.join(token.userId, connection);
                state = {
                    game
                };
            },
            onMessage: message => {
                if (state === States.NEW) {
                    console.error(`Got game message but state was '${state}'`);
                    return close();
                }
                if (state === States.CLOSED) {
                    return close();
                }
                state.game.applyUpdate(message);
            },
            onError: error => {
                console.error(`Got error from client ${error}`);
                connection.close();
            },
            onDisconnected: () => {
                if (state !== States.NEW && state !== States.CLOSED) {
                    state.game.leave(connection);
                }
            }
        };
    }
}
