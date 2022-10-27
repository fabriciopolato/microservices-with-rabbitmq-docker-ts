import fs from "fs/promises";
import path from "path";
import { PoolClient } from "pg";
import dbConnect from "../config/db";
import "./createTables";

const getOutstandingMigrations = async (migrations = []) => {
    const files = await fs.readdir(path.join(__dirname, "..", "sql"));
    const sql = await Promise.all(
        files
            .filter((file) => file.split(".")[1] === "sql")
            .filter((file) => {
                console.log(file);
                return !migrations.includes(file);})
            .map(async (file) => ({
                file,
                query: await fs.readFile(path.join(__dirname, "..", "sql", file), { encoding: "utf-8", }),
            }))
    );
  
    return sql;
};

(async () => {
    let client: PoolClient = null;

    try {
        client = await dbConnect();
        // Check previous migrations
        let existingMigrations = [];
        
        const result = await client.query("SELECT * FROM migrations");
        existingMigrations = result.rows.map(r => r.file);

    
        console.log({ existingMigrations });

        // Get outstanding migrations
        const outstandingMigrations = await getOutstandingMigrations(
            existingMigrations
        );

        await client.query("BEGIN");
        
        // Run each migration sequentially in a transaction
        for (const migration of outstandingMigrations) {
            // Run the migration
            if(migration.query && migration.file) {
                await client.query(migration.query.toString());
                // Keep track of the migration
                await client.query("INSERT INTO migrations (file) VALUES ($1)", [
                    migration.file,
                ]);
            }
        }
        
        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
    } finally {
        client.release();
    }
})();
