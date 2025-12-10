// src/pages/admin/Suppliers.jsx

import { useState } from "react";
import { Box, Paper } from "@mui/material";
import { toast } from "react-toastify";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/searchbar";
import SuppliersTable from "../../components/admin/SupplierManagement/SuppliersTable";
import AddSupplierModal from "../../components/admin/SupplierManagement/AddSupplierModal";
import EditSupplierModal from "../../components/admin/SupplierManagement/EditSupplierModal";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";

// ===============================================
// MOCK DATA (Replace with Redux/Firebase later)
// ===============================================
const MOCK_SUPPLIERS = [
  {
    id: 1,
    name: "Tech Suppliers Inc",
    email: "contact@techsuppliers.com",
    phone: "1234567890",
    address: "123 Tech Street, Silicon Valley, CA 94025",
  },
  {
    id: 2,
    name: "Office Supplies Co",
    email: "info@officesupplies.com",
    phone: "0987654321",
    address: "456 Office Avenue, New York, NY 10001",
  },
  {
    id: 3,
    name: "Global Electronics Ltd",
    email: "sales@globalelectronics.com",
    phone: "5551234567",
    address: "789 Electronics Blvd, Austin, TX 78701",
  },
];

function Suppliers() {
  // ===============================================
  // STATE MANAGEMENT
  // ===============================================
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selected supplier for edit/delete
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // ===============================================
  // FILTER SUPPLIERS (Search)
  // ===============================================
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===============================================
  // HANDLERS
  // ===============================================

  // Add Supplier
  const handleAddSupplier = (newSupplier) => {
    const supplierWithId = {
      ...newSupplier,
      id: suppliers.length + 1, // Generate ID (Firebase will do this)
    };

    setSuppliers([...suppliers, supplierWithId]);
    toast.success("Supplier added successfully!");
  };

  // Edit Supplier
  const handleEditSupplier = (updatedSupplier) => {
    const updatedSuppliers = suppliers.map((supplier) =>
      supplier.id === updatedSupplier.id ? updatedSupplier : supplier
    );

    setSuppliers(updatedSuppliers);
    toast.success("Supplier updated successfully!");
  };

  // Delete Supplier
  const handleDeleteSupplier = () => {
    const updatedSuppliers = suppliers.filter(
      (supplier) => supplier.id !== selectedSupplier.id
    );

    setSuppliers(updatedSuppliers);
    setIsDeleteDialogOpen(false);
    setSelectedSupplier(null);
    toast.success("Supplier deleted successfully!");
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

      {/* Suppliers Table */}
      <SuppliersTable
        suppliers={filteredSuppliers}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
      />

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
      />
    </Box>
  );
}

export default Suppliers;
