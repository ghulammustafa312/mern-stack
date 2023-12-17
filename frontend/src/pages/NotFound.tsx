import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Container } from "@mui/material";

const NotFound = () => {
  return (
    <Container className="flex flex-col items-center justify-center h-screen">
      <Typography variant="h1" className="text-6xl mb-4">
        404
      </Typography>
      <Typography variant="h4" className="mb-8">
        Page Not Found
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Go Home
      </Button>
    </Container>
  );
};

export default NotFound;
