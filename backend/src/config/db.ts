import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();
export const sql = neon(process.env.DATABASE_URL!);

export const connectDB = async () => {
  try {
    await sql`SELECT 1`;

    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1);
  }
};