import axios from 'axios';
import { API_URL } from './api'; // Make sure API_URL is exported from api.ts

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

// Token interface
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
}

// Get tokens from localStorage
export const getTokens = (): AuthTokens | null => {
  const access = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (access && refresh) {
    return { access, refresh };
  }
  return null;
};

// Save tokens to localStorage
export const saveTokens = (tokens: AuthTokens): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
};

// Remove tokens from localStorage (logout)
export const removeTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// Save user data
export const saveUserData = (user: User): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

// Get user data
export const getUserData = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

// Remove user data
export const removeUserData = (): void => {
  localStorage.removeItem(USER_DATA_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Check if user is staff
export const isStaff = (): boolean => {
  const user = getUserData();
  return !!(user?.is_staff || user?.is_superuser);
};

// Login function for Django REST Framework JWT
export const login = async (
  username: string,
  password: string
): Promise<{ user: User; tokens: AuthTokens }> => {
  try {
    // Django REST Framework JWT endpoint
    const response = await axios.post(`${API_URL}/token/`, {
      username,
      password,
    });

    const tokens: AuthTokens = {
      access: response.data.access,
      refresh: response.data.refresh,
    };

    // Save tokens
    saveTokens(tokens);

    // Create user object (you can decode JWT or create from username)
    // For now, create a basic user - you can enhance this by decoding JWT
    const user: User = {
      id: 1, // Temporary - you'll need to get real user ID
      username: username,
      email: `${username}@example.com`, // Placeholder
      is_staff: true, // Assume staff for blog management
      is_superuser: false,
    };
    
    saveUserData(user);

    return { user, tokens };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Login error:', error.response?.data || error.message);
      
      // Handle specific Django error messages
      const errorData = error.response?.data;
      if (errorData?.detail) {
        throw new Error(errorData.detail);
      } else if (errorData?.non_field_errors) {
        throw new Error(errorData.non_field_errors[0]);
      } else if (errorData?.username) {
        throw new Error(`Username: ${errorData.username[0]}`);
      } else if (errorData?.password) {
        throw new Error(`Password: ${errorData.password[0]}`);
      }
    }
    throw new Error('Login failed. Please check your credentials.');
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    // Call Django logout endpoint if using session auth
    if (localStorage.getItem('session_auth')) {
      await axios.post(`${API_URL}/auth/logout/`, {}, { withCredentials: true });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage
    removeTokens();
    removeUserData();
    localStorage.removeItem('session_auth');
  }
};

// Refresh token
export const refreshToken = async (): Promise<AuthTokens | null> => {
  try {
    const tokens = getTokens();
    if (!tokens?.refresh) {
      return null;
    }

    const response = await axios.post(`${API_URL}/token/refresh/`, {
      refresh: tokens.refresh,
    });

    const newTokens: AuthTokens = {
      access: response.data.access,
      refresh: tokens.refresh, // Keep original refresh token
    };

    saveTokens(newTokens);
    return newTokens;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout(); // Force logout if refresh fails
    return null;
  }
};

// Setup axios interceptor for automatic token refresh
export const setupAxiosInterceptors = (): void => {
  // Request interceptor to add token
  axios.interceptors.request.use(
    (config) => {
      const tokens = getTokens();
      if (tokens?.access && config.headers) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 and we haven't tried refreshing yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const newTokens = await refreshToken();
        if (newTokens) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
          return axios(originalRequest);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Initialize auth system
export const initializeAuth = (): void => {
  setupAxiosInterceptors();
};

// Check if we need to refresh token on app start
export const checkAuthStatus = async (): Promise<boolean> => {
  if (!isAuthenticated()) {
    return false;
  }

  try {
    // Just check if we have tokens and user data
    const tokens = getTokens();
    const user = getUserData();
    
    if (!tokens || !user) {
      return false;
    }
    
    // Optional: Verify token is still valid by making a simple API call
    try {
      // Try to fetch posts (public endpoint) with token to check if token works
      // Try to verify token by calling a protected user endpoint
await axios.get(`${API_URL}/auth/user/`, {
  headers: {
    Authorization: `Bearer ${tokens.access}`,
  },
});
      return true;
    } catch (error) {
      // Token might be expired, try to refresh
      const newTokens = await refreshToken();
      return !!newTokens;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};