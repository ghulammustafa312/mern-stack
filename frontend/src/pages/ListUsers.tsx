// UserTable.js

import React, { useState, useEffect } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadMoreData = async () => {
    // Simulate fetching more data from the backend
    const newUsers = await fetchData(page + 1);

    if (newUsers.length === 0) {
      setHasMore(false);
    } else {
      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setPage(page + 1);
    }
  };

  const fetchData = async (pageNumber: number) => {
    const response = await fetch(
      `http://localhost:3000/users?page=${pageNumber}&limit=10`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkhhbGllLk1hY2Vqa292aWM3NUBob3RtYWlsLmNvbSIsInN1YiI6IjY1N2FhNjkxMmVkYjUzNWJiMzJlZDg4ZCIsImlhdCI6MTcwMjU0NDgzMCwiZXhwIjoxNzAyNTQ4NDMwfQ.Rj9HTqHl9uNm-Pl2cO1LQn3rCpTnVLDIP7dOPVcbwxY",
        },
      }
    );
    const data = await response.json();
    return data?.data?.users || [];
  };
  const deleteData = async (userId: string) => {
    try {
      await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkhhbGllLk1hY2Vqa292aWM3NUBob3RtYWlsLmNvbSIsInN1YiI6IjY1N2FhNjkxMmVkYjUzNWJiMzJlZDg4ZCIsImlhdCI6MTcwMjU0NDgzMCwiZXhwIjoxNzAyNTQ4NDMwfQ.Rj9HTqHl9uNm-Pl2cO1LQn3rCpTnVLDIP7dOPVcbwxY",
        },
      });
      fetchData(page);
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      const initialUsers = await fetchData(page);
      setUsers(initialUsers);
      setPage(page + 1);
    };

    initialLoad();
  }, []);

  // Define columns for the table
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "phoneNo", headerName: "Phone No", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleView}>View</MenuItem>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </div>
      ),
    },
  ];
  const handleView = (user) => {
    handleMenuClose();
  };

  const handleEdit = (user) => {
    console.log("Edit user:", user);
    handleMenuClose();
  };

  const handleDelete = (user) => {
    setDeleteModalOpen(true);
    // handleMenuClose();
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const rows = users.map((user: any) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phoneNo: user.phoneNo,
  }));

  const handleDeleteConfirmation = async () => {
    await deleteData(selectedUser?.id);
    setDeleteModalOpen(false);
    handleMenuClose();
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    handleMenuClose();
  };

  // Render loading overlay while fetching more data
  const LoadingOverlay = () => (
    <></>
    // <GridOverlay
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   Loading...
    // </GridOverlay>
  );

  return (
    <div className="w-full h-screen p-8">
      <InfiniteScroll
        dataLength={users.length}
        next={loadMoreData}
        hasMore={hasMore}
        loader={<LoadingOverlay />}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[10]} // Set the number of rows per page
          // rowsPerPageOptions={[10, 20, 50]}
          pagination
        />
      </InfiniteScroll>
      <Dialog open={deleteModalOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmation} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTable;
