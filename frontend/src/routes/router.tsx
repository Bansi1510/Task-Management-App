import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import CreateTask from "../pages/CreateTask";
import EditTask from "../pages/EditTask";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/create-task",
    element: <CreateTask />,
  },
  {
    path: "/edit-task/:id",
    element: <EditTask />,
  },
]);