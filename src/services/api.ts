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

// --- STAFF REGISTRATION FLOW ---
export const registerStaff = async (
  name: string,
  email: string,
  phone: string
) => {
  const token = localStorage.getItem("access");
  const response = await fetch(`${API_URL}/auth/add-staff/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, phone }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to register staff: ${errorText}`);
  }

  return await response.json();
};

// --- FETCH STAFF LIST ---
export const getStaff = async () => {
  const token = localStorage.getItem("access");
  const response = await fetch(`${API_URL}/auth/staff/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch staff");
  return await response.json();
};

export const registerCustomer = async (
  name: string,
  email: string,
  phone: string
) => {
  const token = localStorage.getItem("access");

  const response = await fetch(`${API_URL}/customers/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, phone }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to register customer: ${error}`);
  }

  return await response.json();
};

// --- CONFIRM REGISTRATION (unused for now) ---
export const confirmRegistration = async (email: string, otp: string) => {
  const token = localStorage.getItem("access");
  const response = await axios.post(
    `${API_URL}/auth/confirm-registration/`,
    { email, otp },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// --- FETCH CUSTOMERS ---
export const getCustomers = async () => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/customers/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// --- ACTIVATE CUSTOMER ---
export const activateCustomer = async (customerId: number) => {
  const token = localStorage.getItem("access");
  const response = await fetch(`${API_URL}/customers/activate/${customerId}/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to activate customer: ${err}`);
  }

  return await response.json();
};

// --- TOOLS ---
// Get all tools
export const getTools = async () => {
  const token = localStorage.getItem("access");
  const response = await axios.get(`${API_URL}/tools/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new tool
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

// Update an existing tool (full edit)
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

// Update only tool status
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

// Delete a tool
export const deleteTool = async (id: string) => {
  const token = localStorage.getItem("access");
  const response = await fetch(`${API_URL}/tools/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to delete tool");
  return true;
};
// --- DASHBOARD METRICS ---
export const fetchDashboardData = async () => {
  const token = localStorage.getItem("access");
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.get(`${API_URL}/dashboard/summary/`, { headers });
  const data = response.data;

  return {
    totalTools: data.total_tools,
    totalStaff: data.total_staff,
    totalRevenue: data.total_revenue,
    toolStatusCounts: data.tool_status_counts,
    recentSales: data.recent_sales,
  };
};


