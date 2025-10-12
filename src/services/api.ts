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

// --- CUSTOMER REGISTRATION FLOW ---
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

