import pkg from "pg";
import { db_args } from "./env.js";

const { Pool } = pkg;

const pool = new Pool({
    host: db_args.DB_HOST,
    port: db_args.DB_PORT,
    user: db_args.DB_USER,
    password: db_args.DB_PASSWORD,
    database: db_args.DB_NAME,
});

export default pool;
