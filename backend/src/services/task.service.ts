import { sql } from "../config/db";
import { CreateTaskDTO, Task, UpdateTaskDTO } from "../types/task.types";

export const createTaskService = async (
  data: CreateTaskDTO
): Promise<Task> => {
  const { title, description, completed } = data;

  const result = await sql`
    INSERT INTO tasks (title, description, completed)
    VALUES (${title}, ${description}, ${completed ?? false})
    RETURNING *;
  `;

  return result[0] as Task;
};

export const getTasksService = async (): Promise<Task[]> => {
  return (await sql`
    SELECT *
    FROM tasks
    ORDER BY id DESC;
  `) as Task[];
};

export const updateTaskService = async (
  id: number,
  data: UpdateTaskDTO
): Promise<Task> => {
  const existingTask = await sql`
    SELECT *
    FROM tasks
    WHERE id = ${id};
  `;

  if (!existingTask.length) {
    throw new Error("Task not found");
  }

  const { title, description, completed } = data;

  const result = await sql`
    UPDATE tasks
    SET
      title = ${title},
      description = ${description},
      completed = ${completed}
    WHERE id = ${id}
    RETURNING *;
  `;

  return result[0] as Task;
};

export const deleteTaskService = async (
  id: number
): Promise<void> => {
  const existingTask = await sql`
    SELECT *
    FROM tasks
    WHERE id = ${id};
  `;

  if (!existingTask.length) {
    throw new Error("Task not found");
  }

  await sql`
    DELETE FROM tasks
    WHERE id = ${id};
  `;
};