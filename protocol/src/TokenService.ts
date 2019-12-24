import { Token } from "./Token";

export interface TokenService {
    create(token: Token): Promise<Token>;
    update(token: Token): Promise<Token>;
    delete(tokenID: string): Promise<void>;
}
