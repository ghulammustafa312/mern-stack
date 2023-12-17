import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useLoginUserMutation } from "../redux/api/authApi";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [loginUser, { isLoading, isError, data, error, isSuccess }] = useLoginUserMutation();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(8, "Password must be at least 8 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      loginUser(values)
        .unwrap()
        .then(() => toast.success("Login Successful"))
        .catch((err) => {
          toast.error(err?.data?.message);
        });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md">
        <h2 className="text-3xl font-semibold mb-6">Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </div>
          <div className="mb-4">
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              fullWidth
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </div>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
