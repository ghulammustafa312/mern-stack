import React, { useEffect, useState } from "react";
import { Typography, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery } from "../redux/api/usersApi";

const UserDetail = () => {
  const { userId } = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const { isLoading, isError, error, data } = useGetUserQuery(userId);

  if (!data) {
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <div className="w-full h-screen p-8">
      <Paper elevation={3} className="p-8">
        <Link to="/dashboard">
          <Button startIcon={<ArrowBackIcon />} variant="outlined">
            Back to Users
          </Button>
        </Link>
        <Typography variant="h4" className="mb-4">
          User Detail
        </Typography>
        <div className="mb-4">
          <Typography variant="h6">Name: {data?.name}</Typography>
          <Typography variant="body1">Email: {data?.email}</Typography>
          <Typography variant="body1">Role: {data?.role}</Typography>
          <Typography variant="body1">Phone No: {data?.phoneNo}</Typography>
        </div>
        <Typography variant="h6" className="mb-2">
          Addresses:
        </Typography>
        <ul className="list-disc pl-4">
          {data?.addresses?.length &&
            data?.addresses.map((address: any, index: number) => (
              <li key={index}>
                {address.addressLine1}, {address.addressLine2}, {address.city},{" "}
                {address.state}, {address.country}
              </li>
            ))}
        </ul>
      </Paper>
    </div>
  );
};

export default UserDetail;
