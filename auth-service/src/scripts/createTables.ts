import fs from "fs/promises";
import path from "path";
import dbConnect from "../config/db";

const getMigrations = async () => {
    const files = await fs.readdir(path.join(__dirname, "..", "sql", "createTables"));
    console.log({ files });
    const sql = await Promise.all(
        files
            .filter((file) => file.endsWith(".sql"))
            .map(async (file) => ({
                file,
                query: await fs.readFile(path.join(__dirname, "..", "sql","createTables", file), { encoding: "utf-8", }),
            }))
    );
  
    return sql;
};

(async () => {
    const client = await dbConnect();

    // Get migrations
    const creatingMigrations = await getMigrations();

    console.log({ creatingMigrations });

    try {
        // Run each migration sequentially in a transaction
        for (const migration of creatingMigrations) {
            // Run the migration
            await client.query(migration.query.toString());
        }
    } catch (err) {
        await client.query("ROLLBACK");
    } finally {
        client.release();
    }
})();
