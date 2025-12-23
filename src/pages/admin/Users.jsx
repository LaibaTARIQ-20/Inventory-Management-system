// src/pages/admin/Users.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box, Button, Alert, Snackbar } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// Redux actions
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  clearError,
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
} from "../../redux/slices/userSlice";

// Components
import PageHeader from "../../components/common/PageHeader";
import UsersTable from "../../components/admin/UserManagement/UsersTable";
import AddUserModal from "../../components/admin/UserManagement/AddUserModal";
import EditUserModal from "../../components/admin/UserManagement/EditUserModal";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";

/**
 * Users Management Page
 * Admin page for managing all system users
 */
const Users = () => {
  const dispatch = useDispatch();

  // Redux state
  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  // Local state for modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // ===============================================
  // ADD USER HANDLER
  // ===============================================
  const handleAddUser = async (userData) => {
    try {
      const result = await dispatch(addUser(userData)).unwrap();
      setAddModalOpen(false);
      setSuccessMessage(`User "${result.name}" added successfully!`);
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  // ===============================================
  // EDIT USER HANDLER
  // ===============================================
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const result = await dispatch(
        updateUser({ id: userId, data: userData })
      ).unwrap();
      setEditModalOpen(false);
      setSelectedUser(null);
      setSuccessMessage(`User "${result.name}" updated successfully!`);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  // ===============================================
  // DELETE USER HANDLER
  // ===============================================
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      setSuccessMessage(`User "${selectedUser.name}" deleted successfully!`);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // ===============================================
  // CLOSE HANDLERS
  // ===============================================
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    dispatch(clearError());
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
    dispatch(clearError());
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
  };

  return (
    <Container maxWidth="xl">
      {/* Page Header */}
      <PageHeader
        title="Users Management"
        subtitle="Manage system users and their permissions"
      />

      {/* Action Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setAddModalOpen(true)}
          size="large"
        >
          Add New User
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <UsersTable
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      {/* Add User Modal */}
      <AddUserModal
        open={addModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleAddUser}
        loading={loading}
        error={error}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateUser}
        user={selectedUser}
        loading={loading}
        error={error}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete"
        itemName={selectedUser?.name}
        loading={loading}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Users;
