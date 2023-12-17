import { Link, Navigate, useOutlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logout } from "../redux/features/user.slice";

export const ProtectedLayout = () => {
  const { user } = useAppSelector((state) => state.userState);
  const outlet = useOutlet();
  const dispatch = useAppDispatch();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Mern Stack Project
          </Link>

          <div>
            <span className="mr-2">{user.name}</span>
            <button
              onClick={() => {
                dispatch(logout());
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content Outlet */}
      <main className="container mx-auto mt-4">{outlet}</main>
    </div>
  );
};
