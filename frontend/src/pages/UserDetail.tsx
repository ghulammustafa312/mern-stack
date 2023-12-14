import React, { useEffect, useState } from "react";
import { Typography, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const fetchData = async (userId?: string) => {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkhhbGllLk1hY2Vqa292aWM3NUBob3RtYWlsLmNvbSIsInN1YiI6IjY1N2FhNjkxMmVkYjUzNWJiMzJlZDg4ZCIsImlhdCI6MTcwMjU0ODcwMSwiZXhwIjoxNzAyNTUyMzAxfQ.VmIQlsT2xTyvhNv2s3UGwh30ZOeXKAN5ZL19T3w6USU",
      },
    });
    const data = await response.json();
    setDataLoaded(true);
    setUser(data?.data);
  };
  useEffect(() => {
    fetchData(userId);
  }, []);
  if (!user) {
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <div className="w-full h-screen p-8">
      <Paper elevation={3} className="p-8">
        <Link to="/list">
          <Button startIcon={<ArrowBackIcon />} variant="outlined">
            Back to Users
          </Button>
        </Link>
        <Typography variant="h4" className="mb-4">
          User Detail
        </Typography>
        <div className="mb-4">
          <Typography variant="h6">Name: {user?.name}</Typography>
          <Typography variant="body1">Email: {user?.email}</Typography>
          <Typography variant="body1">Role: {user?.role}</Typography>
          <Typography variant="body1">Phone No: {user?.phoneNo}</Typography>
        </div>
        <Typography variant="h6" className="mb-2">
          Addresses:
        </Typography>
        <ul className="list-disc pl-4">
          {user?.addresses?.length &&
            user?.addresses.map((address: any, index: number) => (
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
