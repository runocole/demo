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

// --- STAFF MANAGEMENT 
// --- FETCH STAFF LIST ---
export const getStaff = async () => {
  const token = localStorage.getItem("access");
  const response = await fetch(`${API_URL}/auth/staff/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch staff");
  return await response.json();
};

// --- ACTIVATE STAFF ACCOUNT ---
export const activateStaff = async (staffId: number) => {
  const token = localStorage.getItem("access");
  const response = await fetch(`${API_URL}/auth/staff/${staffId}/activate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to activate staff");
  return await response.json();
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
// --- UPDATE TOOL STATUS ---
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

// --- DELETE TOOL ---
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

  const [toolsRes, paymentsRes, StaffRes] = await Promise.all([
    axios.get(`${API_URL}/tools/`, { headers }),
    axios.get(`${API_URL}/payments/`, { headers }),
    axios.get(`${API_URL}/Staff/`, { headers }),
  ]);

  const tools = toolsRes.data;
  const payments = paymentsRes.data;
  const Staff = StaffRes.data;

  // --- Aggregations ---
  const totalTools = tools.length;
  const totalStaff = Staff.length;

  // MTD (month-to-date) revenue
  const currentMonth = new Date().getMonth() + 1;
  const mtdRevenue = payments
    .filter((p: any) => p.status === "completed")
    .filter(
      (p: any) => new Date(p.created_at).getMonth() + 1 === currentMonth
    )
    .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);

  // Tool status overview
  const toolStatusCounts = tools.reduce(
    (acc: any, t: any) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { available: 0, rented: 0, maintenance: 0, disabled: 0 }
  );

  return {
    totalTools,
    totalStaff,
    mtdRevenue,
    toolStatusCounts,
  };
};


