import { Client, QueryResult } from "pg";
import format from "pg-format";
import { lazy } from "../Module";

export { format as formatQuery };
export function formatIdentifier(identifier: string) {
    return format("%I", identifier);
}

export class Database {
    constructor(
        readonly host: string,
        readonly port: number,
        readonly user: string,
        readonly password: string,
        readonly schema: string
    ) {}

    getClient = lazy(async () => {
        const client = new Client({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
        });
        await client.connect();
        return client;
    });

    async query(
        query: string,
        values?: (string | number)[]
    ): Promise<QueryResult> {
        try {
            return await (await this.getClient()).query(query, values);
        } catch (e) {
            console.log(query, e);
            throw e;
        }
    }
}
