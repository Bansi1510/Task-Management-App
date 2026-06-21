
import {
  Button,
  Checkbox,
  Chip,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { Task } from "../types/task";
import { deleteTask, getTasks, updateTask } from "../services/taskService";

const Home = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      toast.success("Task deleted successfully");
    },

    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, task }: { id: number; task: Omit<Task, "id"> }) =>
      updateTask(id, task),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      toast.success("Task updated successfully");
    },

    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleToggle = (task: Task) => {
    toggleMutation.mutate({
      id: task.id,
      task: {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      },
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography align="center">
          Loading tasks...
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
      }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            Task Manager
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage your daily tasks efficiently
          </Typography>
        </div>

        <Button
          component={Link}
          to="/create-task"
          variant="contained"
        >
          Add Task
        </Button>
      </div>

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <Paper
            key={task.id}
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
            }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    textDecoration: task.completed
                      ? "line-through"
                      : "none",
                  }}
                >
                  {task.title}
                </Typography>

                <Chip
                  label={
                    task.completed
                      ? "Completed"
                      : "Pending"
                  }
                  color={
                    task.completed
                      ? "success"
                      : "warning"
                  }
                  size="small"
                  sx={{ mt: 1 }}
                />
              </div>

              <Checkbox
                checked={task.completed}
                onChange={() => handleToggle(task)}
              />
            </div>

            <Typography
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              {task.description}
            </Typography>

            <div className="d-flex gap-2 mt-3">
              <Button
                fullWidth
                component={Link}
                to={`/edit - task/${task.id}`}
                state={{ task }}
                variant="outlined"
              >
                Edit
              </Button>

              <Button
                fullWidth
                color="error"
                variant="contained"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </Button>
            </div>
          </Paper>
        ))
      ) : (
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Typography color="text.secondary">
            No Tasks Found
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Home;

