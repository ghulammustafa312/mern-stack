// UserEdit.js

import React, { useEffect } from "react";
import { Typography, Paper, Button, TextField, IconButton, Grid, MenuItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateUserMutation, useGetUserQuery, useUpdateUserMutation } from "../redux/api/usersApi";
import toast from "react-hot-toast";
const UserEdit = () => {
  const { userId } = useParams();
  const { isError, isLoading, error, data: user, isSuccess } = useGetUserQuery(userId);
  const [updateUser, { isSuccess: updateSuccess, error: updateError }] = useUpdateUserMutation();
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
    initialValues: {
      name: "",
      email: "",
      role: "",
      phoneNo: "",
      addresses: [
        {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          country: "",
        },
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      updateUser({ id: userId, user: values })
        .unwrap()
        .then(() => toast.success("Updated Successfully"))
        .catch((err) => {
          toast.error(err?.data?.message);
        });
    },
  });

  useEffect(() => {
    if (isSuccess && user) {
      formik.setValues({
        ...user,
      });
    }
  }, [isSuccess]);
  const handleAddAddress = () => {
    formik.setValues({
      ...formik.values,
      addresses: [
        ...formik.values.addresses,
        {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          country: "",
        },
      ],
    });
  };

  const handleDeleteAddress = (index: number) => {
    const newAddresses = [...formik.values.addresses];
    newAddresses.splice(index, 1);
    formik.setValues({
      ...formik.values,
      addresses: newAddresses,
    });
  };

  return (
    <div className="w-full h-screen p-8">
      <Paper elevation={3} className="p-8">
        <Link to={`/dashboard`}>
          <Button startIcon={<ArrowBackIcon />} variant="outlined">
            Back to User
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
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled
          />
          <TextField
            fullWidth
            label="Role"
            variant="outlined"
            margin="normal"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
            select
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="USER">User</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Phone No"
            variant="outlined"
            margin="normal"
            name="phoneNo"
            value={formik.values.phoneNo}
            onChange={formik.handleChange}
            error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
            helperText={formik.touched.phoneNo && formik.errors.phoneNo}
          />
          <Typography variant="h6" className="mt-4 mb-2">
            Addresses:
          </Typography>
          {formik.values.addresses.map((address: any, index: number) => (
            <Grid container spacing={2} key={index} className="mb-2">
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  variant="outlined"
                  margin="normal"
                  name={`addresses[${index}].addressLine1`}
                  value={address.addressLine1}
                  onChange={formik.handleChange}
                  error={
                    formik?.touched?.addresses &&
                    formik?.touched?.addresses[index]?.addressLine1 &&
                    Boolean(formik.errors.addresses?.[index]?.addressLine1)
                  }
                  helperText={
                    formik?.touched?.addresses && formik?.touched?.addresses[index]?.addressLine1 && formik.errors.addresses?.[index]?.addressLine1
                  }
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  variant="outlined"
                  margin="normal"
                  name={`addresses[${index}].addressLine2`}
                  value={address.addressLine2}
                  onChange={formik.handleChange}
                  error={
                    formik?.touched?.addresses &&
                    formik?.touched?.addresses[index]?.addressLine2 &&
                    Boolean(formik.errors.addresses?.[index]?.addressLine2)
                  }
                  helperText={
                    formik?.touched?.addresses && formik?.touched?.addresses[index]?.addressLine2 && formik.errors.addresses?.[index]?.addressLine2
                  }
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="City"
                  variant="outlined"
                  margin="normal"
                  name={`addresses[${index}].city`}
                  value={address.city}
                  onChange={formik.handleChange}
                  error={formik?.touched?.addresses && formik?.touched?.addresses[index]?.city && Boolean(formik.errors.addresses?.[index]?.city)}
                  helperText={formik?.touched?.addresses && formik?.touched?.addresses[index]?.city && formik.errors.addresses?.[index]?.city}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="State"
                  variant="outlined"
                  margin="normal"
                  name={`addresses[${index}].state`}
                  value={address.state}
                  onChange={formik.handleChange}
                  error={formik?.touched?.addresses && formik?.touched?.addresses[index]?.state && Boolean(formik.errors.addresses?.[index]?.state)}
                  helperText={formik?.touched?.addresses && formik?.touched?.addresses[index]?.state && formik.errors.addresses?.[index]?.state}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Country"
                  variant="outlined"
                  margin="normal"
                  name={`addresses[${index}].country`}
                  value={address.country}
                  onChange={formik.handleChange}
                  error={
                    formik?.touched?.addresses && formik?.touched?.addresses[index]?.country && Boolean(formik.errors.addresses?.[index]?.country)
                  }
                  helperText={formik?.touched?.addresses && formik?.touched?.addresses[index]?.country && formik.errors.addresses?.[index]?.country}
                />
              </Grid>

              {formik.values.addresses.length > 1 && (
                <Grid item xs={2} className="flex items-center">
                  <IconButton color="secondary" onClick={() => handleDeleteAddress(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}
          <Button color="primary" onClick={handleAddAddress} className="mb-2" variant="outlined" startIcon={<AddIcon />}>
            Add
          </Button>
          <div className="flex justify-end p-2">
            <Button type="submit" variant="contained" color="primary" className="mt-4">
              Save Changes
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default UserEdit;
