import { Player } from "./Player";

export class Game {
    players: Player[] = [];

    constructor(readonly id: string) {}
}
