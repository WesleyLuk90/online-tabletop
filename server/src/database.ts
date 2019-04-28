import { Sequelize } from "sequelize";

export async function createDatabase(): Promise<Sequelize> {
    return new Sequelize(process.env.DATABASE_CONNECTION);
}
