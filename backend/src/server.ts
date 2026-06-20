import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 1510

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});