import { Navigate, useOutlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";

export const UserLayout = () => {
  const { user } = useAppSelector((state) => state.userState);
  const outlet = useOutlet();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <div>{outlet}</div>;
};
