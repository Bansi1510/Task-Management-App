import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { Task } from "../types/task";
import { updateTask } from "../services/taskService";
import { taskSchema } from "../validations/task.validation";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const task = location.state?.task as Task;

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

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

    const result = taskSchema.safeParse({
      title,
      description,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
      });

      return;
    }

    setErrors({});

    updateMutation.mutate({
      id: Number(id),
      task: {
        title: title.trim(),
        description: description.trim(),
        completed: task.completed,
      },
    });
  };

  if (!task) {
    return (
      <Container maxWidth="lg" className="mt-5">
        <Typography variant="h6">Task data not found</Typography>
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
            margin="normal"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);

              if (errors.title) {
                setErrors((prev) => ({
                  ...prev,
                  title: undefined,
                }));
              }
            }}
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            label="Task Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);

              if (errors.description) {
                setErrors((prev) => ({
                  ...prev,
                  description: undefined,
                }));
              }
            }}
            error={!!errors.description}
            helperText={errors.description}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
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
