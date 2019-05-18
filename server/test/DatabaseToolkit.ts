import { Sequelize } from "sequelize";

export function testDatabase(logging: boolean = false): Sequelize {
    return new Sequelize("sqlite://:memory:", {
        logging: logging ? () => {} : undefined
    });
}
