import express from "express";
import cors from "cors";
import taskRouter from "./routes/task.routes";

const app = express();


app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
));
app.use(express.json());

app.use("/tasks", taskRouter);


export default app;