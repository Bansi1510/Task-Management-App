import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,

} from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.post("/", createTask);
taskRouter.get("/", getTasks);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);


export default taskRouter;