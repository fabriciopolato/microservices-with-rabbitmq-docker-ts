import fs from "fs/promises";
import path from "path";
import dbConnect from "../config/db";

const getMigrations = async () => {
    const files = await fs.readdir(path.join(__dirname, "..", "sql", "dropTables"));
    const sql = await Promise.all(
        files
            .filter((file) => file.split(".")[1] === "sql")
            .map(async (file) => ({
                file,
                query: await fs.readFile(path.join(__dirname, "..", "sql","dropTables", file), { encoding: "utf-8", }),
            }))
    );
  
    return sql;
};

(async () => {
    const client = await dbConnect();

    // Get migrations
    const dropMigrations = await getMigrations();

    try {
        await client.query("BEGIN");
        
        // Run each migration sequentially in a transaction
        for (const migration of dropMigrations) {
            // Run the migration
            await client.query(migration.query.toString());
        }
        
        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
    } finally {
        client.release();
    }
})();
