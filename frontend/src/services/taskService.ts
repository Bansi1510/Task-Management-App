import axios from "axios";
import type { Task } from "../types/task";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");
  return response.data.data;
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  console.log(task)
  const response = await api.post("/tasks", task);
  console.log(response.data.data)
  return response.data.data;
};

export const updateTask = async (
  id: number,
  task: Omit<Task, "id">,
): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
