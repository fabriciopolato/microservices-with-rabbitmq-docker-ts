import fs from "fs";
import { promisify } from "util";
import dbConnect from "../../config/db";

const getMigrations = async () => {
    const files = await promisify(fs.readdir)(__dirname);
    const sql = await Promise.all(
        files
            .filter((file) => file.split(".")[1] === "sql")
            .map(async (file) => ({
                file,
                query: await promisify(fs.readFile)(`${__dirname}/${file}`, { encoding: "utf-8", }),
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
