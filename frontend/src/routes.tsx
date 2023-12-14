import { useRoutes } from "react-router-dom";
import Login from "./pages/Login";
import ListUsers from "./pages/ListUsers";
import UserDetail from "./pages/UserDetail";
import EditUser from "./pages/EditUser";
import CreateUser from "./pages/CreateUser";
import NotFound from "./pages/NotFound";
import UserLayout from "./components/UserLayout";

function AllRoutes() {
  const element = useRoutes([
    { path: "/", element: <Login /> },
    {
      path: "/list",
      element: <UserLayout />,
      children: [
        { index: true, element: <ListUsers /> },
        { path: ":userId", element: <UserDetail /> },
      ],
    },
    { path: "/edit/:userId", element: <EditUser /> },
    { path: "/create", element: <CreateUser /> },

    { path: "*", element: <NotFound /> },
  ]);
  return element;
}

export default AllRoutes;
