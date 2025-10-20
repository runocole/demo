import axios from "axios";

const API_URL = "http://localhost:8000/api";
// --- AUTH ---
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login/`, {
      email,
      password,
    });
    return response.data; // { access, refresh, user }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Login error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
    throw error;
  }
};

// --- STAFF REGISTRATION ---
export const registerStaff = async (name: string, email: string, phone: string) => {
  const token = localStorage.getItem("access");
  const response = await axios.post(
    `${API_URL}/auth/add-staff/`,
    { name, email, phone },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// --- FETCH STAFF LIST ---
export const getStaff = async () => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/auth/staff/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// --- CUSTOMER MANAGEMENT ---
export const getCustomers = async () => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/customers/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const registerCustomer = async (name: string, email: string, phone: string, state: string) => {
  const token = localStorage.getItem("access");
  const response = await axios.post(
    `${API_URL}/customers/add`,
    { name, email, phone, state },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};


export const activateCustomer = async (customerId: number) => {
  const token = localStorage.getItem("access");
  const response = await axios.post(
    `${API_URL}/customers/activate/${customerId}/`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
// --- SALES ---
export const getSales = async () => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/sales/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSaleDetail = async (id: number) => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/sales/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createSale = async (saleData: any) => {
  const token = localStorage.getItem("access");
  const response = await axios.post(`${API_URL}/sales/`, saleData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSale = async (id: number, saleData: any) => {
  const token = localStorage.getItem("access");
  const response = await axios.put(`${API_URL}/sales/${id}/`, saleData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// --- PAYMENTS ---
export const getPayments = async () => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/payments/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// --- TOOLS ---
export const getTools = async () => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/tools/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTool = async (toolData: {
  name: string;
  description?: string;
  code: string;
  cost: string;
  status: string;
  category?: string;
  stock?: number;
  supplier?: string;
}) => {
  const token = localStorage.getItem("access");
  const response = await axios.post(`${API_URL}/tools/`, toolData, {
    headers: {
      Authorization: `Bearer ${token}`,
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
  const token = localStorage.getItem("access");
  const response = await axios.patch(`${API_URL}/tools/${id}/`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateToolStatus = async (id: string, status: string) => {
  const token = localStorage.getItem("access");
  const response = await fetch(`${API_URL}/tools/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error("Failed to update tool status");
  return await response.json();
};

export const deleteTool = async (id: string) => {
  const token = localStorage.getItem("access");
  const response = await fetch(`${API_URL}/tools/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to delete tool");
  return true;
};

// --- DASHBOARD METRICS (fixed & complete) ---
export const fetchDashboardData = async () => {
  const token = localStorage.getItem("access");
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.get(`${API_URL}/dashboard/summary/`, { headers });
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
