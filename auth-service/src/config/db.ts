import { Pool, PoolClient } from "pg";

export const connect = async (): Promise<PoolClient> => {
    if (global.connection)
        return global.connection.connect();
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    try {
        const client = await pool.connect();
 
        //testing connection
        const res = await client.query("SELECT NOW()");
        console.log(`connected at ${res.rows[0].now}`);
        client.release();
 
        //saving to use same pool
        global.connection = pool;
        return pool.connect();
    } catch (error) {
        throw new Error(error);
    }
};

export default connect;
