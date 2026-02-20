// src/pages/Sales/index.tsx
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { DashboardLayout } from "../../components/DashboardLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Types
import type { Customer, AssignmentResult } from "./types";

// Components
import { CustomerSearch } from "./components/CustomerSearch";
import { SalesTable } from "./components/SalesTable";
import { AddSaleDialog } from "./components/AddSaleDialog";
import { EquipmentTypeModal } from "./components/EquipmentTypeModal";
import { AssignmentModal } from "./components/AssignmentModal";
import { EditStatusDialog } from "./components/EditStatusDialog";
import { ViewSerialsDialog } from "./components/ViewSerialsDialog";

// Hooks
import { useSalesData } from "./hooks/useSalesData";
import { useSaleForm } from "./hooks/useSaleForm";
import { useToolAssignment } from "./hooks/useToolAssignment";

// Utils
import { api } from "./utils/api";

export default function SalesPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEquipmentTypeModal, setShowEquipmentTypeModal] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [viewingSerials, setViewingSerials] = useState<{
    open: boolean;
    tool: any | null;
    soldSerials: any[];
  }>({
    open: false,
    tool: null,
    soldSerials: []
  });

  // Custom hooks
  const {
    sales,
    customers,
    tools,
    groupedTools,
    setGroupedTools,
    loading,
    fetchGroupedTools,
    addSale,
    updateSaleStatus
  } = useSalesData();

  const {
    saleItems,
    currentItem,
    saleDetails,
    totalCost,
    addItem,
    removeItem,
    updateCurrentItem,
    updateSaleDetails,
    resetForm
  } = useSaleForm();

  const {
    assignmentResult,
    assignRandomTool,
    clearAssignment
  } = useToolAssignment();

  // Fetch grouped tools when category changes
  useEffect(() => {
    if (currentItem.selectedCategory) {
      fetchGroupedTools(
        currentItem.selectedCategory,
        currentItem.selectedEquipmentType
      ).then(data => setGroupedTools(data));
    } else {
      setGroupedTools([]);
    }
  }, [currentItem.selectedCategory, currentItem.selectedEquipmentType]);

  const handleCategorySelect = (category: string) => {
    updateCurrentItem({
      selectedCategory: category,
      selectedEquipmentType: "",
      selectedTool: null,
      cost: ""
    });

    if (category === "Receiver") {
      setShowEquipmentTypeModal(true);
    }
  };

  const handleEquipmentTypeSelect = (equipmentType: string) => {
    updateCurrentItem({ selectedEquipmentType: equipmentType });
    setShowEquipmentTypeModal(false);
  };

  const handleToolSelect = (toolName: string) => {
    const selected = groupedTools.find(tool => tool.name === toolName);
    if (selected) {
      updateCurrentItem({
        selectedTool: selected,
        cost: currentItem.cost || String(selected.cost || "")
      });
    }
  };

  const handleAddItem = async () => {
    if (!currentItem.selectedTool || !currentItem.cost) {
      alert("Please select equipment and enter a Selling Price.");
      return;
    }

    try {
      const assignment = await assignRandomTool(currentItem);
      
      const newItem = {
        tool_id: assignment.assigned_tool_id,
        equipment: assignment.tool_name,
        cost: currentItem.cost,
        category: currentItem.selectedCategory,
        serial_set: assignment.serial_set,
        external_radio_serial: assignment.external_radio_serial,
        datalogger_serial: assignment.datalogger_serial,
        assigned_tool_id: assignment.assigned_tool_id,
        invoice_number: assignment.invoice_number,
        import_invoice: assignment.import_invoice
      };

      addItem(newItem);
      
      updateCurrentItem({
        selectedCategory: "",
        selectedEquipmentType: "",
        selectedTool: null,
        cost: ""
      });
      
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSaveSale = async (action: "draft" | "send") => {
    if (!selectedCustomer) {
      alert("Please select a customer first.");
      return;
    }

    if (saleItems.length === 0) {
      alert("Please add at least one item to the sale.");
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date();
      const dateSold = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const payload = {
        name: selectedCustomer.name,
        phone: selectedCustomer.phone,
        state: selectedCustomer.state,
        items: saleItems,
        total_cost: totalCost.toString(),
        payment_plan: saleDetails.payment_plan || "",
        initial_deposit: saleDetails.payment_plan === "No" ? null : (saleDetails.initial_deposit || null),
        payment_months: saleDetails.payment_plan === "No" ? null : (saleDetails.payment_months || null),
        expiry_date: saleDetails.expiry_date || null,
        invoice_number: saleItems[0]?.invoice_number || "",
        import_invoice: saleItems[0]?.import_invoice || "",
        date_sold: dateSold,
      };

      const res = await api.createSale(payload);
      addSale(res.data);

      if (action === "send" && selectedCustomer?.email) {
        await api.sendSaleEmail(
          selectedCustomer.email,
          selectedCustomer.name,
          saleItems,
          totalCost,
          res.data.invoice_number
        );
      }

      resetForm();
      setSelectedCustomer(null);
      setOpen(false);
      
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("Failed to save sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!editingSale || !newPaymentStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      await api.updateSaleStatus(editingSale.id, newPaymentStatus);
      updateSaleStatus(editingSale.id, newPaymentStatus);
      setEditStatusOpen(false);
    } catch (error) {
      alert("Failed to update payment status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleViewSerials = async (tool: any) => {
    try {
      const response = await api.getSoldSerials(tool.id);
      setViewingSerials({
        open: true,
        tool,
        soldSerials: response.data
      });
    } catch (error) {
      console.error("Error fetching sold serials:", error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("My Sales Records", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [[
        "Client", "Phone", "State", "Items", "Serial Numbers",
        "Price", "Date Sold", "Sales Invoice", "Import Invoice",
        "Payment Plan", "Initial Deposit", "Payment Months", "Expiry", "Status",
      ]],
      body: sales.map((s) => [
        s.name,
        s.phone,
        s.state,
        s.items.map(item => item.equipment).join(', '),
        s.items.map(item => 
          item.serial_set ? 
            `Receiver: ${item.serial_set.join(', ')}${item.datalogger_serial ? `, Datalogger: ${item.datalogger_serial}` : ''}` 
            : 'No serials'
        ).join('; '),
        `₦${s.total_cost}`,
        s.date_sold,
        s.invoice_number || "-",
        s.import_invoice || "-",
        s.payment_plan || "-",
        s.initial_deposit ? `₦${s.initial_deposit}` : "-", 
        s.payment_months || "-",        
        s.expiry_date || "-",
        s.payment_status || "-",
      ]),
      styles: { fontSize: 7 },
    });
    doc.save("my_sales_records.pdf");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <CustomerSearch
          customers={customers}
          onSelectCustomer={(customer) => {
            setSelectedCustomer(customer);
            setOpen(true);
          }}
          onAddSaleClick={() => setOpen(true)}
          selectedCustomer={selectedCustomer}
          onClearCustomer={() => {
            setSelectedCustomer(null);
            resetForm();
          }}
        />

        <div className="flex justify-end gap-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={exportPDF}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        <EquipmentTypeModal
          open={showEquipmentTypeModal}
          onOpenChange={setShowEquipmentTypeModal}
          selectedType={currentItem.selectedEquipmentType}
          onSelect={handleEquipmentTypeSelect}
          onCancel={() => {
            setShowEquipmentTypeModal(false);
            updateCurrentItem({ selectedCategory: "" });
          }}
        />

        <AssignmentModal
          assignment={assignmentResult}
          onClose={clearAssignment}
        />

        <AddSaleDialog
          open={open}
          onOpenChange={setOpen}
          selectedCustomer={selectedCustomer}
          currentItem={currentItem}
          groupedTools={groupedTools}
          filteredGroupedTools={groupedTools}
          saleItems={saleItems}
          saleDetails={saleDetails}
          totalCost={totalCost}
          isSubmitting={isSubmitting}
          onCategoryChange={handleCategorySelect}
          onEquipmentTypeChange={handleEquipmentTypeSelect}
          onToolSelect={handleToolSelect}
          onCostChange={(cost) => updateCurrentItem({ cost })}
          onAddItem={handleAddItem}
          onRemoveItem={removeItem}
          onPaymentPlanChange={(value) => {
            updateSaleDetails({
              payment_plan: value,
              initial_deposit: value === "No" ? "" : saleDetails.initial_deposit,
              payment_months: value === "No" ? "" : saleDetails.payment_months
            });
          }}
          onInitialDepositChange={(value) => updateSaleDetails({ initial_deposit: value })}
          onPaymentMonthsChange={(value) => updateSaleDetails({ payment_months: value })}
          onExpiryDateChange={(value) => updateSaleDetails({ expiry_date: value })}
          onSaveDraft={() => handleSaveSale("draft")}
          onSaveAndSend={() => handleSaveSale("send")}
          onCancel={() => {
            resetForm();
            setSelectedCustomer(null);
            setOpen(false);
          }}
        />

        <EditStatusDialog
          open={editStatusOpen}
          onOpenChange={setEditStatusOpen}
          sale={editingSale}
          paymentStatus={newPaymentStatus}
          onStatusChange={setNewPaymentStatus}
          onUpdate={handleUpdateStatus}
          isUpdating={isUpdatingStatus}
        />

        <ViewSerialsDialog
          open={viewingSerials.open}
          onOpenChange={(open) => setViewingSerials(prev => ({ ...prev, open }))}
          tool={viewingSerials.tool}
          soldSerials={viewingSerials.soldSerials}
          onClose={() => setViewingSerials({ open: false, tool: null, soldSerials: [] })}
        />

        <SalesTable
          sales={sales}
          tools={tools}
          loading={loading}
          onEditStatus={(sale) => {
            setEditingSale(sale);
            setNewPaymentStatus(sale.payment_status || "pending");
            setEditStatusOpen(true);
          }}
          onViewSerials={handleViewSerials}
        />
      </div>
    </DashboardLayout>
  );
}