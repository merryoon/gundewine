
import "dotenv/config";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing from your .env file");
}

const sql = postgres(databaseUrl);

export default sql;
