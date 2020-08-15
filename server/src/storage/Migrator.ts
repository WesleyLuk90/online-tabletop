import { BaseSchema, Field, KnownSchemas } from "./BaseSchema";
import { Database } from "./Database";

export class Migrator {
    constructor(readonly db: Database) {}
    async migrate() {
        this.ensureSchema();
        await this.db.query(`SET search_path TO ${this.db.schema}`);
        const tables = await this.tables();
        for (let schema of KnownSchemas) {
            await this.migrateSchema(schema, tables);
        }
    }

    async ensureSchema() {
        const schemas = await this.schemas();
        if (!schemas.includes(this.db.schema)) {
            await this.db.query(`CREATE SCHEMA ${this.db.schema}`);
        }
    }

    async schemas(): Promise<string[]> {
        const res = await this.db.query(
            "SELECT * FROM pg_catalog.pg_namespace"
        );
        return res.rows.map((r) => r.nspname);
    }

    async tables(): Promise<string[]> {
        const res = await this.db.query(
            "SELECT * FROM pg_catalog.pg_tables WHERE schemaname = $1",
            [this.db.schema]
        );
        return res.rows.map((row) => row.tablename);
    }

    async migrateSchema(schema: BaseSchema, tables: string[]) {
        if (!tables.includes(schema.tableName)) {
            function primaryKey(field: Field<{}>) {
                if (field == schema.primaryKey) {
                    return "PRIMARY KEY";
                }
                return "";
            }
            const columns = schema.fields.map((field) =>
                [field.name, field.type.postgresType, primaryKey(field)].join(
                    " "
                )
            );
            await this.db.query(
                `CREATE TABLE ${schema.tableName} (${columns.join(", ")})`
            );
        }
    }
}
