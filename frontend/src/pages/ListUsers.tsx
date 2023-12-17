import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteUserMutation, useLazyGetAllUsersQuery } from "../redux/api/usersApi";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const [fetchUsers, { isLoading, isError, error, data: usersData }] = useLazyGetAllUsersQuery({ page, limit: 10 });
  const [deleteUser, { isLoading: deleteLoading, isError: isDeleteError, error: deleteError }] = useDeleteUserMutation();
  const loadMoreData = async () => {
    try {
      const result = await fetchUsers({ page: page + 1, limit: 10 });
      setPage(page + 1);
      setUsers((prevUsers) => [
        ...prevUsers,
        ...result?.data?.users?.map((user: any) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNo: user.phoneNo,
        })),
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers({ page: 1, limit: 10 }).then((result) => {
      setUsers(
        result?.data?.users?.map((user: any) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNo: user.phoneNo,
        }))
      );
      setPage(1);
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>No Data Found</p>;
  }

  // Define columns for the table
  const columns = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 300 },
    { field: "email", headerName: "Email", width: 400 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "phoneNo", headerName: "Phone No", width: 200 },
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
  const handleView = (user: any) => {
    handleMenuClose();
    navigate(`/dashboard/detail/${selectedUser?.id}`);
  };

  const handleEdit = (user: any) => {
    handleMenuClose();
    navigate(`/dashboard/edit/${selectedUser?.id}`);
  };

  const handleDelete = (user: any) => {
    setDeleteModalOpen(true);
    // handleMenuClose();
  };

  const handleMenuOpen = (event: any, user: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleDeleteConfirmation = async () => {
    deleteUser(selectedUser?.id)
      .unwrap()
      .then(() => toast.success("User deleted successfully"))
      .catch((err) => toast.error(err?.data?.message))
      .finally(() => {
        const userIndex = users.indexOf(selectedUser);
        users.splice(userIndex, 1);
        setDeleteModalOpen(false);
        handleMenuClose();
      });
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    handleMenuClose();
  };

  const Row = ({ index, style, data }: any) => (
    <div className={`flex items-center px-4 py-2 border-b border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out`} style={style}>
      {users[index] === undefined ? (
        <p>Loading</p>
      ) : (
        columns.map((column) => (
          <div key={column.field} style={{ width: column.width }} className="flex-none">
            {column.field === "actions" ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <IconButton onClick={(event) => handleMenuOpen(event, users[index])}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorReference="anchorPosition"
                  anchorPosition={
                    anchorEl ? { top: anchorEl.getBoundingClientRect().bottom, left: anchorEl.getBoundingClientRect().left } : undefined
                  }
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleView}>View</MenuItem>
                  <MenuItem onClick={handleEdit}>Edit</MenuItem>
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>
              </div>
            ) : (
              <p>{users[index][column.field]}</p>
            )}
          </div>
        ))
      )}
    </div>
  );

  const isItemLoaded = (index: number) => {
    return typeof users[index] === undefined;
  };

  const DataGridHeader = () => (
    <div className="flex items-center px-4 py-2 border-b border-gray-200">
      {columns.map((column) => (
        <div key={column.field} style={{ width: column.width }} className="flex-none">
          <strong>{column.headerName}</strong>
        </div>
      ))}
    </div>
  );

  return (
    <div className="m-2">
      <div className="flex justify-end p-2">
        <Link to={"/dashboard/create"}>
          <Button onClick={handleDeleteCancel} color="primary">
            Create
          </Button>
        </Link>
      </div>
      <DataGridHeader />
      <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={usersData?.meta?.total || 0} loadMoreItems={loadMoreData}>
        {({ onItemsRendered, ref }) => (
          <List
            className="List"
            height={500}
            itemCount={usersData?.meta?.total || 0}
            itemSize={40}
            onItemsRendered={onItemsRendered}
            ref={ref}
            width={window.screen.width}
          >
            {Row}
          </List>
        )}
      </InfiniteLoader>

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
