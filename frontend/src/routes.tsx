import { useRoutes } from "react-router-dom";
import Login from "./pages/Login";
import ListUsers from "./pages/ListUsers";
import UserDetail from "./pages/UserDetail";
import EditUser from "./pages/EditUser";
import CreateUser from "./pages/CreateUser";
import NotFound from "./pages/NotFound";
import { UserLayout } from "./components/UserLayout";
import { ProtectedLayout } from "./components/ProtectedLayout";

function AllRoutes() {
  const element = useRoutes([
    {
      element: <UserLayout />,
      children: [{ index: true, element: <Login /> }],
    },
    {
      path: "/dashboard",
      element: <ProtectedLayout />,
      children: [
        { index: true, element: <ListUsers /> },
        { path: "detail/:userId", element: <UserDetail /> },
        { path: "edit/:userId", element: <EditUser /> },
        { path: "create", element: <CreateUser /> },
      ],
    },

    { path: "*", element: <NotFound /> },
  ]);
  return element;
}

export default AllRoutes;
