export class Random {
    static randomDice(sides: number) {
        return 1 + Math.floor(Math.random() * sides);
    }
}
