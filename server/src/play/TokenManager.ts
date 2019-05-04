import { randomFill } from "crypto";

interface Token {
    userId: string;
    gameId: string;
    token: string;
    timestamp: number;
}

const FLUSH_TIME = 30000;
const TOKEN_BYTE_COUNT = 16;

export class TokenManager {
    tokens: Token[] = [];
    constructor(readonly flushTime: number = FLUSH_TIME) {
        setTimeout(this.flush, flushTime);
    }

    flush = () => {
        const stale = new Date().getTime() - FLUSH_TIME;
        this.tokens = this.tokens.filter(t => t.timestamp > stale);
    };

    async create(gameId: string, userId: string): Promise<Token> {
        const existing = this.tokens.find(
            t => t.gameId === gameId && t.userId === userId
        );
        if (existing != null) {
            return existing;
        }
        const bytes = await new Promise<Buffer>((res, rej) =>
            randomFill(Buffer.alloc(TOKEN_BYTE_COUNT), (err, buf) => {
                if (err) {
                    rej(err);
                } else {
                    res(buf);
                }
            })
        );
        const token = {
            userId,
            gameId,
            timestamp: new Date().getTime(),
            token: bytes.toString("base64")
        };
        this.tokens.push(token);
        return token;
    }

    get(token: string): Token | null {
        const t = this.tokens.find(t => t.token === token);
        this.tokens = this.tokens.filter(t => t.token !== token);
        return t || null;
    }
}
