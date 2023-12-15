import { Navigate, useOutlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";

export const ProtectedLayout = () => {
  const { user } = useAppSelector((state) => state.userState);
  console.log(
    "🚀 ~ file: ProtectedLayout.tsx:6 ~ ProtectedLayout ~ user:",
    user
  );
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  return <div>{outlet}</div>;
};
