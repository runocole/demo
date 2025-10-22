import axios from "axios";

const API_URL = "http://localhost:8000/api";

// ----------------------------
// TYPES
// ----------------------------
export interface ReceiverType {
  id: string;
  name: string;
  default_cost: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

// ----------------------------
// AUTH HEADER
// ----------------------------
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

// ----------------------------
// AUTH
// ----------------------------
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login/`, { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Login error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
    throw error;
  }
};

// ----------------------------
// STAFF
// ----------------------------
export const registerStaff = async (name: string, email: string, phone: string) => {
  const response = await axios.post(
    `${API_URL}/auth/add-staff/`,
    { name, email, phone },
    { headers: authHeader() }
  );
  return response.data;
};

export const getStaff = async () => {
  const response = await axios.get(`${API_URL}/auth/staff/`, {
    headers: authHeader(),
  });
  return response.data;
};

// ----------------------------
// CUSTOMERS
// ----------------------------
export const getCustomers = async () => {
  const response = await axios.get(`${API_URL}/customers/`, {
    headers: authHeader(),
  });
  return response.data;
};

export const registerCustomer = async (
  name: string,
  email: string,
  phone: string,
  state: string
) => {
  const response = await axios.post(
    `${API_URL}/customers/add`,
    { name, email, phone, state },
    { headers: authHeader() }
  );
  return response.data;
};

export const activateCustomer = async (customerId: number) => {
  const response = await axios.post(
    `${API_URL}/customers/activate/${customerId}/`,
    {},
    { headers: authHeader() }
  );
  return response.data;
};

// ----------------------------
// SALES
// ----------------------------
export const getSales = async () => {
  const response = await axios.get(`${API_URL}/sales/`, {
    headers: authHeader(),
  });
  return response.data;
};

export const getSaleDetail = async (id: number) => {
  const response = await axios.get(`${API_URL}/sales/${id}/`, {
    headers: authHeader(),
  });
  return response.data;
};

export const createSale = async (saleData: any) => {
  const response = await axios.post(`${API_URL}/sales/`, saleData, {
    headers: authHeader(),
  });
  return response.data;
};

export const updateSale = async (id: number, saleData: any) => {
  const response = await axios.put(`${API_URL}/sales/${id}/`, saleData, {
    headers: authHeader(),
  });
  return response.data;
};

// ----------------------------
// PAYMENTS
// ----------------------------
export const getPayments = async () => {
  const response = await axios.get(`${API_URL}/payments/`, {
    headers: authHeader(),
  });
  return response.data;
};

// ----------------------------
// TOOLS
// ----------------------------
export const getTools = async () => {
  const response = await axios.get(`${API_URL}/tools/`, {
    headers: authHeader(),
  });
  return response.data;
};

export const createTool = async (toolData: {
  name: string;
  description?: string;
  code: string;
  cost: string;
  category?: string;
  stock?: number;
  supplier?: string;
}) => {
  const response = await axios.post(`${API_URL}/tools/`, toolData, {
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateTool = async (
  id: string,
  updatedData: Partial<{
    name: string;
    description: string;
    code: string;
    cost: string;
    status: string;
    category: string;
    stock: number;
    supplier: string;
  }>
) => {
  const response = await axios.patch(`${API_URL}/tools/${id}/`, updatedData, {
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateToolStatus = async (id: string, status: string) => {
  const response = await fetch(`${API_URL}/tools/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error("Failed to update tool status");
  return await response.json();
};

export const deleteTool = async (id: string) => {
  const response = await fetch(`${API_URL}/tools/${id}/`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!response.ok) throw new Error("Failed to delete tool");
  return true;
};

// ----------------------------
// DASHBOARD
// ----------------------------
export const fetchDashboardData = async () => {
  const response = await axios.get(`${API_URL}/dashboard/summary/`, {
    headers: authHeader(),
  });
  const data = response.data;

  return {
    totalTools: data.totalTools ?? data.total_tools,
    totalStaff: data.totalStaff ?? data.total_staff,
    activeCustomers: data.activeCustomers ?? data.active_customers ?? 0,
    mtdRevenue: data.mtdRevenue ?? data.total_revenue ?? 0,
    toolStatusCounts: data.toolStatusCounts ?? data.tool_status_counts ?? {},
    inventoryBreakdown: data.inventoryBreakdown ?? data.inventory_breakdown ?? [],
    lowStockItems: data.lowStockItems ?? data.low_stock_items ?? [],
    topSellingTools: data.topSellingTools ?? data.top_selling_tools ?? [],
    recentSales: data.recentSales ?? data.recent_sales ?? [],
  };
};

// ----------------------------
// RECEIVER TYPES
// ----------------------------
export const getReceiverTypes = async () => {
  const response = await axios.get(`${API_URL}/receiver-types/`, {
    headers: authHeader(),
  });
  return response.data;
};

export const createReceiverType = async (receiverTypeData: {
  name: string;
  default_cost: string;
  description?: string;
}) => {
  const response = await axios.post(`${API_URL}/receiver-types/`, receiverTypeData, {
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateReceiverType = async (
  id: string,
  receiverTypeData: Partial<{
    name: string;
    default_cost: string;
    description?: string;
  }>
) => {
  const response = await axios.patch(`${API_URL}/receiver-types/${id}/`, receiverTypeData, {
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteReceiverType = async (id: string) => {
  const response = await axios.delete(`${API_URL}/receiver-types/${id}/`, {
    headers: authHeader(),
  });
  return response.data;
};

// ----------------------------
// SUPPLIERS
// ----------------------------
export const getSuppliers = async () => {
  const response = await axios.get(`${API_URL}/suppliers/`, {
    headers: authHeader(),
  });
  return response.data;
};

export const createSupplier = async (supplierData: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  const response = await axios.post(`${API_URL}/suppliers/`, supplierData, {
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateSupplier = async (
  id: string,
  supplierData: Partial<{
    name: string;
    email: string;
    phone: string;
    address: string;
  }>
) => {
  const response = await axios.patch(`${API_URL}/suppliers/${id}/`, supplierData, {
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteSupplier = async (id: string) => {
  const response = await axios.delete(`${API_URL}/suppliers/${id}/`, {
    headers: authHeader(),
  });
  return response.data;
};
