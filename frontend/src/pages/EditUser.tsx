// UserEdit.js

import React, { useState } from "react";
import { Typography, Paper, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

const UserEdit = () => {
  const user = {
    _id: "657aa6912edb535bb32ef67c",
    name: "Olen1",
    email: "Michel_Effertz82@hotmail.com",
    password: "$2b$10$7GGD29Og6ARZbY299LPgheav9XqL5INj7QNlHeOPZHGCAK9pxKVbC",
    addresses: [
      {
        addressLine1: "148 Bartell Ville",
        addressLine2: "Apt. 413",
        city: "Marielaville",
        state: "Alabama",
        country: "Saint Kitts and Nevis",
      },
    ],
    role: "USER",
    phoneNo: "927-236-8512 x95694",
    createdAt: "2023-12-14T06:54:10.588Z",
    updatedAt: "2023-12-14T06:54:10.588Z",
  };
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    phoneNo: user.phoneNo,
    addresses: user.addresses.map((address) => ({ ...address })),
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newAddresses = [...editedUser.addresses];
    newAddresses[index][name] = value;

    setEditedUser({
      ...editedUser,
      addresses: newAddresses,
    });
  };

  const handleSave = () => {
    // Implement the logic to save edited user details
    console.log("Edited User:", editedUser);
  };

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
        <form>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            name="name"
            value={editedUser.name}
            onChange={(e) =>
              setEditedUser({ ...editedUser, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            name="email"
            value={editedUser.email}
            onChange={(e) =>
              setEditedUser({ ...editedUser, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Role"
            variant="outlined"
            margin="normal"
            name="role"
            value={editedUser.role}
            onChange={(e) =>
              setEditedUser({ ...editedUser, role: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Phone No"
            variant="outlined"
            margin="normal"
            name="phoneNo"
            value={editedUser.phoneNo}
            onChange={(e) =>
              setEditedUser({ ...editedUser, phoneNo: e.target.value })
            }
          />
          <Typography variant="h6" className="mt-4 mb-2">
            Addresses:
          </Typography>
          {editedUser.addresses.map((address, index) => (
            <div key={index} className="mb-2">
              <TextField
                fullWidth
                label="Address Line 1"
                variant="outlined"
                margin="normal"
                name="addressLine1"
                value={address.addressLine1}
                onChange={(e) => handleInputChange(e, index)}
              />
              <TextField
                fullWidth
                label="Address Line 2"
                variant="outlined"
                margin="normal"
                name="addressLine2"
                value={address.addressLine2}
                onChange={(e) => handleInputChange(e, index)}
              />
              {/* Add other address fields as needed */}
            </div>
          ))}
          <Button
            variant="contained"
            color="primary"
            className="mt-4"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default UserEdit;
