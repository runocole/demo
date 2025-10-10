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
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// --- CUSTOMER REGISTRATION FLOW ---
export const registerCustomer = async (email: string, role: string) => {
  const token = localStorage.getItem("access");
  const response = await axios.post(
    `${API_URL}/auth/register/`,
    { email, role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

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
