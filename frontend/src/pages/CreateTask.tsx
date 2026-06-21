import { Button, Container, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../services/taskService";
import { toast } from "react-toastify";
import { taskSchema } from "../validations/task.validation";

const CreateTask = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      toast.success("Task created successfully");
      navigate("/");
    },
    onError: () => {
      toast.error("Failed to create task");
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

    createMutation.mutate({
      title,
      description,
      completed: false,
    });
  };

  return (
    <Container maxWidth="lg" className="mt-5">
      <Paper className="p-4 shadow-sm">
        <Typography variant="h4" className="mb-4">
          Create Task
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
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Saving..." : "Save Task"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateTask;
