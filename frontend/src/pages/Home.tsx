import {
  Button,
  Checkbox,
  Chip,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
      <Container sx={{ py: 5 }}>
        <Typography align="center">
          Loading tasks...
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
      }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            Task Management
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

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div className="table-responsive">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Task</TableCell>
                <TableCell>Description</TableCell>
                <TableCell width={220}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="d-flex align-items-center gap-2">
                        <Checkbox
                          checked={task.completed}
                          onChange={() =>
                            handleToggle(task)
                          }
                        />

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
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          textDecoration:
                            task.completed
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {task.title}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {task.description}
                    </TableCell>

                    <TableCell>
                      <div className="d-flex gap-2 flex-wrap">
                        <Button
                          component={Link}
                          to={`/edit-task/${task.id}`}
                          state={{ task }}
                          variant="outlined"
                          size="small"
                        >
                          Edit
                        </Button>

                        <Button
                          color="error"
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleDelete(task.id)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                  >
                    No Tasks Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </Container>
  );
};

export default Home;