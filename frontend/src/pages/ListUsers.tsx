// UserTable.js

import React, { useState, useEffect } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import InfiniteScroll from "react-infinite-scroll-component";
import { FixedSizeList } from "react-window";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteUserMutation, useGetAllUsersQuery } from "../redux/api/usersApi";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoading, isError, error, data: usersData } = useGetAllUsersQuery({ page, limit: 10 });
  const [deleteUser, { isLoading: deleteLoading, isError: isDeleteError, error: deleteError }] = useDeleteUserMutation();
  const loadMoreData = async () => {
    // const newUsers = await fetchData(page + 1);
    // if (newUsers.length === 0) {
    //   setHasMore(false);
    // } else {
    //   setUsers((prevUsers) => [...prevUsers, ...newUsers]);
    //   setPage(page + 1);
    // }
  };

  // useEffect(() => {
  //   const initialLoad = async () => {
  //     // const initialUsers = await fetchData(page);
  //     // setUsers(initialUsers);
  //     setPage(page + 1);
  //   };

  //   initialLoad();
  // }, []);

  if (isLoading) {
    return <Loader />;
  }
  // if (isError) {
  // }
  // if (usersData) {
  //   setUsers(usersData?.users);
  // }

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
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
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
    navigate(`/dashboard/detail/${selectedUser?.id}`);
  };

  const handleEdit = (user) => {
    handleMenuClose();
    navigate(`/dashboard/edit/${selectedUser?.id}`);
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

  const rows = usersData?.users?.map((user: any) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phoneNo: user.phoneNo,
  }));

  const handleDeleteConfirmation = async () => {
    deleteUser(selectedUser?.id)
      .unwrap()
      .then(() => toast.success("User deleted successfully"))
      .catch((err) => toast.error(err?.data?.message))
      .finally(() => {
        setDeleteModalOpen(false);
        handleMenuClose();
      });
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    handleMenuClose();
  };

  // Render loading overlay while fetching more data
  const LoadingOverlay = () => (
    <div>Loading ...</div>
    // <GridOverlay
    //   style={{
    //     display: "flex",
    //     // justifyInfiniteScrollContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   Loading...
    // </GridOverlay>
  );

  const Row = ({ index, style }) => (
    <div style={style}>
      <DataGrid rows={[rows[index]]} columns={columns} pageSizeOptions={[1]} autoHeight />
    </div>
  );

  return (
    <div>
      <div className="flex justify-end p-2">
        <Link to={"/dashboard/create"}>
          <Button onClick={handleDeleteCancel} color="primary">
            Create
          </Button>
        </Link>
      </div>
      <InfiniteScroll
        dataLength={usersData?.users?.length || 0}
        next={loadMoreData}
        hasMore={hasMore}
        loader={<LoadingOverlay />}
        height={window.screen.availHeight}
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
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
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
