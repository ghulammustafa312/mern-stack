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
        <div className="flex flex-col items-center max-w-screen-md mx-auto">
          <Typography variant="h3" className="mb-4">
            User Detail
          </Typography>
          <div className="mb-4">
            <Typography variant="h5">Name: {data?.name}</Typography>
            <Typography variant="h5">Email: {data?.email}</Typography>
            <Typography className="capitalize" variant="h5">
              Role: <b>{data?.role?.toLowerCase()}</b>
            </Typography>
            <Typography variant="h5">Phone No: {data?.phoneNo}</Typography>
          </div>
          <Typography variant="h6" className="mb-2">
            Addresses:
          </Typography>
          <ul className="list-disc pl-4">
            {data?.addresses?.length &&
              data?.addresses.map((address: any, index: number) => (
                <li key={index}>
                  {address.addressLine1}, {address.addressLine2}, {address.city}, {address.state}, {address.country}
                </li>
              ))}
          </ul>
        </div>
      </Paper>
    </div>
  );
};

export default UserDetail;
