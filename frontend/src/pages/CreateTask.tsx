import { Button, Container, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../services/taskService";
import { toast } from "react-toastify";

const CreateTask = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

    createMutation.mutate({
      title,
      description,
      completed: false,
    });
  };

  return (
    <Container maxWidth="lg" className="mt-5">
      <Paper className="p-4 shadow-sm">
        <Typography variant="h4" className="mb-4 text-dark">
          Create Task
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
