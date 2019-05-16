import { Connection } from "./ConnectionManager";

export class Player {
    constructor(
        readonly name: string,
        readonly id: string,
        readonly connection: Connection
    ) {}
}
