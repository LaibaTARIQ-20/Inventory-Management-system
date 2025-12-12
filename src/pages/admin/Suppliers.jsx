// src/pages/admin/Suppliers.jsx - CONNECTED TO FIREBASE

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Paper, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import SuppliersTable from "../../components/admin/SupplierManagement/SuppliersTable";
import AddSupplierModal from "../../components/admin/SupplierManagement/AddSupplierModal";
import EditSupplierModal from "../../components/admin/SupplierManagement/EditSupplierModal";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";

// Redux actions
import {
  setSuppliers,
  addSupplier as addSupplierAction,
  updateSupplier as updateSupplierAction,
  deleteSupplier as deleteSupplierAction,
  setSupplierLoading,
  setSupplierError,
} from "../../redux/slices/supplierSlice";

// Firebase service
import {
  fetchSuppliers,
  addSupplier as addSupplierToFirebase,
  updateSupplier as updateSupplierInFirebase,
  deleteSupplier as deleteSupplierFromFirebase,
} from "../../services/supplierService";

function Suppliers() {
  const dispatch = useDispatch();

  // Redux state
  const { suppliers, loading } = useSelector((state) => state.suppliers);

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Fetch suppliers on mount
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      dispatch(setSupplierLoading(true));

      const result = await fetchSuppliers();

      if (result.success) {
        dispatch(setSuppliers(result.suppliers));
      } else {
        dispatch(setSupplierError(result.error));
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error loading suppliers:", error);
      toast.error("Failed to load suppliers");
    } finally {
      dispatch(setSupplierLoading(false));
    }
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CRUD Handlers
  const handleAddSupplier = async (supplierData) => {
    try {
      const result = await addSupplierToFirebase(supplierData);

      if (result.success) {
        dispatch(addSupplierAction(result.supplier));
        toast.success("Supplier added successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error("Failed to add supplier");
    }
  };

  const handleEditSupplier = async (updatedSupplier) => {
    try {
      const { id, ...supplierData } = updatedSupplier;

      const result = await updateSupplierInFirebase(id, supplierData);

      if (result.success) {
        dispatch(updateSupplierAction(result.supplier));
        toast.success("Supplier updated successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Failed to update supplier");
    }
  };

  const handleDeleteSupplier = async () => {
    try {
      setDeleteLoading(true);

      const result = await deleteSupplierFromFirebase(selectedSupplier.id);

      if (result.success) {
        dispatch(deleteSupplierAction(selectedSupplier.id));
        toast.success("Supplier deleted successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier");
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  // Open Delete Dialog
  const handleOpenDeleteDialog = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };

  // ===============================================
  // RENDER
  // ===============================================
  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        title="Suppliers"
        subtitle="Manage your product suppliers"
        buttonText="Add Supplier"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      {/* Search Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search suppliers by name..."
          fullWidth
        />
      </Paper>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Suppliers Table */
        <SuppliersTable
          suppliers={filteredSuppliers}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}

      {/* Add Supplier Modal */}
      <AddSupplierModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSupplier}
      />

      {/* Edit Supplier Modal */}
      <EditSupplierModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSupplier(null);
        }}
        onSubmit={handleEditSupplier}
        supplier={selectedSupplier}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedSupplier(null);
        }}
        onConfirm={handleDeleteSupplier}
        title="Delete Supplier"
        message="Are you sure you want to delete"
        itemName={selectedSupplier?.name}
        loading={deleteLoading}
      />
    </Box>
  );
}

export default Suppliers;
