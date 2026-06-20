import { Request, Response } from "express";
import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
} from "../services/task.service";
import { resHandler } from "../utils/resHandler";
import { getErrorMessage } from "../utils/getErrorMessage";

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await createTaskService(req.body);


    resHandler(res, 201, {
      success: true,
      message: "Task created successfully",
      data: task,
    });


  } catch (error: unknown) {
    resHandler(res, 500, {
      success: false,
      message: getErrorMessage(error),
    });
  }
};

export const getTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tasks = await getTasksService();


    resHandler(res, 200, {
      success: true,
      data: tasks,
    });
  } catch (error: unknown) {
    resHandler(res, 500, {
      success: false,
      message: getErrorMessage(error),
    });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await updateTaskService(
      Number(req.params.id),
      req.body
    );

    resHandler(res, 200, {
      success: true,
      message: "Task updated successfully",
      data: task,
    });


  } catch (error: unknown) {
    resHandler(res, 500, {
      success: false,
      message: getErrorMessage(error),
    });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await deleteTaskService(Number(req.params.id));


    resHandler(res, 200, {
      success: true,
      message: "Task deleted successfully",
    });


  } catch (error: unknown) {
    resHandler(res, 500, {
      success: false,
      message: getErrorMessage(error),
    });
  }
};
