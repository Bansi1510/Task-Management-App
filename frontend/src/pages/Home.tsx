import {
  Button,
  Checkbox,
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

import type { Task } from "../types/task";
import { getTasks, deleteTask, updateTask } from "../services/taskService";
import { toast } from "react-toastify";

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
      <Container className="mt-5">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="mt-5">
      <div className="d-flex justify-content-between align-items-center flex-nowrap mb-4">
        <Typography variant="h4" className="mb-0">
          Task Management
        </Typography>

        <Button component={Link} to="/create-task" variant="contained">
          Add Task
        </Button>
      </div>

      <Paper className="shadow-sm">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell width={200}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggle(task)}
                    />
                  </TableCell>

                  <TableCell
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </TableCell>

                  <TableCell>{task.description}</TableCell>

                  <TableCell>
                    <Button
                      component={Link}
                      to={`/edit-task/${task.id}`}
                      state={{ task }}
                      variant="outlined"
                      size="small"
                      className="me-2"
                    >
                      Edit
                    </Button>

                    <Button
                      color="error"
                      variant="contained"
                      size="small"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Tasks Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Home;
