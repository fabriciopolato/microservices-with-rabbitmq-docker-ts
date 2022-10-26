import fs from "fs";
import { promisify } from "util";
import dbConnect from "../config/db";

const getOutstandingMigrations = async (migrations = []) => {
    const files = await promisify(fs.readdir)(__dirname);
    const sql = await Promise.all(
        files
            .filter((file) => file.split(".")[1] === "sql")
            .filter((file) => !migrations.includes(file))
            .map(async (file) => ({
                file,
                query: await promisify(fs.readFile)(`${__dirname}/${file}`, { encoding: "utf-8", }),
            }))
    );
  
    return sql;
};

(async () => {
    const client = await dbConnect();
    // Check previous migrations
    let existingMigrations = [];
    try {
        const result = await client.query("SELECT * FROM migrations");
        existingMigrations = result.rows.map(r => r.file);
    } catch {
        console.warn("First migration");
    }
    
    // Get outstanding migrations
    const outstandingMigrations = await getOutstandingMigrations(
        existingMigrations
    );

    try {
        await client.query("BEGIN");
        
        // Run each migration sequentially in a transaction
        for (const migration of outstandingMigrations) {
            // Run the migration
            await client.query(migration.query.toString());
            // Keep track of the migration
            await client.query("INSERT INTO migrations (file) VALUES ($1)", [
                migration.file,
            ]);
        }
        
        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
    } finally {
        client.release();
    }
})();
