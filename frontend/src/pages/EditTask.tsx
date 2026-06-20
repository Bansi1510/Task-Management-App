import { Button, Container, Paper, TextField, Typography } from "@mui/material";

import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Task } from "../types/task";
import { updateTask } from "../services/taskService";
import { toast } from "react-toastify";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const task = location.state?.task as Task;

  const [title, setTitle] = useState(task?.title || "");

  const [description, setDescription] = useState(task?.description || "");

  const updateMutation = useMutation({
    mutationFn: ({ id, task }: { id: number; task: Omit<Task, "id"> }) =>
      updateTask(id, task),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      toast.success("Task updated successfully");
      navigate("/");
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate({
      id: Number(id),
      task: {
        title,
        description,
        completed: task.completed,
      },
    });
  };

  if (!task) {
    return (
      <Container className="mt-5">
        <Typography>Task data not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="mt-5">
      <Paper className="p-4 shadow-sm">
        <Typography variant="h4" className="mb-4">
          Edit Task
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Task Title"
            fullWidth
            className="mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Task Description"
            fullWidth
            multiline
            rows={4}
            className="mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update Task"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditTask;
