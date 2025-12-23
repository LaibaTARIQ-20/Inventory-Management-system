// src/pages/admin/Suppliers.jsx
// UPDATED: Added "View Map" button to navigate to SuppliersMap page

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ NEW
import { Box, Paper, CircularProgress, Button } from "@mui/material";
import { toast } from "react-toastify";
import MapIcon from "@mui/icons-material/Map"; // ✅ NEW

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import SuppliersTable from "../../components/admin/SupplierManagement/SuppliersTable";
import AddSupplierModal from "../../components/admin/SupplierManagement/AddSupplierModal";
import EditSupplierModal from "../../components/admin/SupplierManagement/EditSupplierModal";
import ViewSupplierModal from "../../components/admin/SupplierManagement/ViewSupplierModal";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";

// Redux actions
import {
  fetchSuppliers as fetchSuppliersAction,
  addSupplier as addSupplierAction,
  updateSupplier as updateSupplierAction,
  deleteSupplier as deleteSupplierAction,
} from "../../redux/slices/supplierSlice";

// Firebase service
// (No longer needed - using Redux thunks instead)

function Suppliers() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ NEW

  // Redux state
  const { suppliers, loading } = useSelector((state) => state.suppliers);

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Fetch suppliers on mount
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const result = await dispatch(fetchSuppliersAction());
    } catch (error) {
      console.error("Error loading suppliers:", error);
      toast.error("Failed to load suppliers");
    }
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CRUD Handlers
  const handleAddSupplier = async (supplierData) => {
    try {
      const result = await dispatch(addSupplierAction(supplierData));
      if (result.payload) {
        toast.success("Supplier added successfully!");
        setIsAddModalOpen(false);
      } else {
        toast.error(result.payload || "Failed to add supplier");
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error("Failed to add supplier");
    }
  };

  const handleEditSupplier = async (updatedSupplier) => {
    try {
      const { id, ...supplierData } = updatedSupplier;

      const result = await dispatch(
        updateSupplierAction({ id, data: supplierData })
      );

      if (result.payload) {
        toast.success("Supplier updated successfully!");
        setIsEditModalOpen(false);
      } else {
        toast.error(result.payload || "Failed to update supplier");
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Failed to update supplier");
    }
  };

  const handleDeleteSupplier = async () => {
    try {
      setDeleteLoading(true);

      const result = await dispatch(deleteSupplierAction(selectedSupplier.id));

      if (result.payload) {
        toast.success("Supplier deleted successfully!");
        setIsDeleteDialogOpen(false);
        setSelectedSupplier(null);
      } else {
        toast.error(result.payload || "Failed to delete supplier");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open View Modal
  const handleOpenViewModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsViewModalOpen(true);
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

  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        title="Suppliers"
        subtitle="Manage your product suppliers"
        buttonText="Add Supplier"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      {/* Search Section + View Map Button */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suppliers by name..."
            sx={{ flex: 1, minWidth: 300 }}
          />

          {/* ✅ NEW: View Map Button */}
          <Button
            variant="outlined"
            startIcon={<MapIcon />}
            onClick={() => navigate("/admin/suppliers/map")}
            sx={{ whiteSpace: "nowrap" }}
          >
            View Map
          </Button>
        </Box>
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
          onView={handleOpenViewModal}
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

      {/* View Supplier Modal */}
      <ViewSupplierModal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSupplier(null);
        }}
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
