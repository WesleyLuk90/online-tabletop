import { Socket } from "socket.io";

export class Player {
    constructor(
        readonly name: string,
        readonly id: string,
        readonly socket: Socket
    ) {}
}
