import React from "react";
import { Typography, Paper, Button, TextField, MenuItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useParams } from "react-router-dom";
import { useGetUserQuery, useUpdateUserMutation } from "../redux/api/usersApi";
import { FieldArray, useFormik } from "formik";
import * as Yup from "yup";

const UserEdit = () => {
  const { userId } = useParams();
  const { isLoading, isError, error, data: user } = useGetUserQuery(userId);
  const [updateUser, { isLoading: updateLoading, isError: isUpdated, error: updateError }] = useUpdateUserMutation();
  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    phoneNo: user?.phoneNo || "",
    addresses: user?.addresses?.map((address: any) => ({ ...address })) || [],
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    role: Yup.string().required("Required"),
    phoneNo: Yup.string().required("Required"),
    addresses: Yup.array().of(
      Yup.object({
        addressLine1: Yup.string().required("Required"),
        addressLine2: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        state: Yup.string().required("Required"),
        country: Yup.string().required("Required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // Implement the logic to save edited user details
      console.log("Edited User:", values);
    },
  });

  return (
    <div className="w-full h-screen p-8">
      <Paper elevation={3} className="p-8">
        <Link to={`/list`}>
          <Button startIcon={<ArrowBackIcon />} variant="outlined">
            Back to User Detail
          </Button>
        </Link>
        <Typography variant="h4" className="mb-4">
          Edit User
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.touched.name && formik.errors.name && <div className="text-red-500">{formik.errors.name}</div>}

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            disabled
          />

          <TextField
            fullWidth
            label="Role"
            variant="outlined"
            margin="normal"
            name="role"
            select
            value={formik.values.role}
            onChange={formik.handleChange}
          >
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </TextField>
          {formik.touched.role && formik.errors.role && <div className="text-red-500">{formik.errors.role}</div>}

          <TextField
            fullWidth
            label="Phone No"
            variant="outlined"
            margin="normal"
            name="phoneNo"
            value={formik.values.phoneNo}
            onChange={formik.handleChange}
          />
          {formik.touched.phoneNo && formik.errors.phoneNo && <div className="text-red-500">{formik.errors.phoneNo}</div>}
          <Typography variant="h6" className="mt-4 mb-2">
            Addresses:
          </Typography>
          <FieldArray name="addresses">
            {({ push, remove }) => (
              <>
                {formik.values.addresses.map((address: any, index: number) => (
                  <div key={index} className="mb-2">
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      variant="outlined"
                      margin="normal"
                      name={`addresses[${index}].addressLine1`}
                      value={address.addressLine1}
                      onChange={formik.handleChange}
                    />
                    {/* {formik?.touched?.addresses[index] && formik?.errors?.addresses[index]?.addressLine1 && (
                      <div className="text-red-500">{formik.errors.addresses[index].addressLine1}</div>
                    )} */}

                    <TextField
                      fullWidth
                      label="Address Line 2"
                      variant="outlined"
                      margin="normal"
                      name={`addresses[${index}].addressLine2`}
                      value={address.addressLine2}
                      onChange={formik.handleChange}
                    />
                    {/* {formik?.touched?.addresses[index] && formik?.errors?.addresses[index]?.addressLine2 && (
                      <div className="text-red-500">{formik.errors.addresses[index].addressLine2}</div>
                    )} */}

                    <TextField
                      fullWidth
                      label="City"
                      variant="outlined"
                      margin="normal"
                      name={`addresses[${index}].city`}
                      value={address.city}
                      onChange={formik.handleChange}
                    />
                    {/* {formik?.touched?.addresses[index] && formik?.errors?.addresses[index]?.city && (
                      <div className="text-red-500">{formik.errors.addresses[index].city}</div>
                    )} */}

                    <TextField
                      fullWidth
                      label="State"
                      variant="outlined"
                      margin="normal"
                      name={`addresses[${index}].state`}
                      value={address.state}
                      onChange={formik.handleChange}
                    />
                    {/* {formik?.touched?.addresses[index] && formik?.errors?.addresses[index]?.state && (
                      <div className="text-red-500">{formik.errors.addresses[index].state}</div>
                    )} */}

                    <TextField
                      fullWidth
                      label="Country"
                      variant="outlined"
                      margin="normal"
                      name={`addresses[${index}].country`}
                      value={address.country}
                      onChange={formik.handleChange}
                    />
                    {/* {formik?.touched?.addresses[index] && formik?.errors?.addresses[index]?.country && (
                      <div className="text-red-500">{formik.errors.addresses[index].country}</div>
                    )} */}

                    {/* Remove address button */}
                    {/* <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        formik.values.addresses.length > 1 && remove(index);
                      }}
                    >
                      Remove Address
                    </Button> */}
                  </div>
                ))}
                {/* Add address button */}
                {/* <Button
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    push({
                      addressLine1: "",
                      addressLine2: "",
                      city: "",
                      state: "",
                      country: "",
                    })
                  }
                >
                  Add Address
                </Button> */}
              </>
            )}
          </FieldArray>
          <Button type="submit" variant="contained" color="primary" className="mt-4">
            Save Changes
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default UserEdit;
