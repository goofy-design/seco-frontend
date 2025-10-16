import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './../../utils/axios';
import API_CONSTANTS from './../../utils/apiConstants';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  auth_type: string;
  created_at: string;
  updated_at: string | null;
  reset_password_token: string | null;
  reset_password_expires: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  hasFetchedUser: boolean;
}
const isValidUser = (obj: any): obj is User => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const requiredFields: (keyof User)[] = ['id', 'name', 'email', 'role', 'auth_type', 'created_at'];
  return requiredFields.every((field) => typeof obj[field] === 'string') &&
    (obj.updated_at === null || typeof obj.updated_at === 'string') &&
    (obj.reset_password_token === null || typeof obj.reset_password_token === 'string') &&
    (obj.reset_password_expires === null || typeof obj.reset_password_expires === 'string');
};

const initialState: AuthState = {
  user: (() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return null;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (isValidUser(parsedUser)) {
        return parsedUser;
      } else {
        console.warn('Invalid user object in localStorage:', parsedUser);
        localStorage.removeItem('user'); 
        return null;
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user'); 
      return null;
    }
  })(),
  loading: false,
  error: null,
  hasFetchedUser: false,
};
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const hashedPassword = await hashPassword(password);
      const response = await axiosInstance.post(API_CONSTANTS.LOGIN, {
        email,
        password: hashedPassword,
      });
      if (response.status === 200) {
        return response.data.user;
      } else {
        return rejectWithValue(`Unexpected response status: ${response.status}`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);
export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { name, email, password, role }: { name: string; email: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const hashedPassword = await hashPassword(password);
      const response = await axiosInstance.post(API_CONSTANTS.SIGNUP, {
        name,
        email,
        password: hashedPassword,
        role: role.toLowerCase(),
      });
      if (response.status === 201) {
        return response.data.user;
      } else {
        return rejectWithValue(`Unexpected response status: ${response.status}`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Signup failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post(API_CONSTANTS.LOGOUT);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Logout failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    if (state.auth.hasFetchedUser) {
      return null;
    }
    try {
      const response = await axiosInstance.get(API_CONSTANTS.CURRENT_USER);
      if (response.status === 200) {
        return response.data.user;
      } else {
        return rejectWithValue('User not found or session expired.');
      }
    } catch (error: any) {
      return rejectWithValue('User not found or session expired.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.error = null;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.hasFetchedUser = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.hasFetchedUser = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.hasFetchedUser = false;
        localStorage.removeItem('user');
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.hasFetchedUser = false;
        localStorage.removeItem('user');
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload === null) {
          state.loading = false;
          return;
        }
        state.user = action.payload;
        state.hasFetchedUser = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.hasFetchedUser = true;
        localStorage.removeItem('user');
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsLoggedIn = (state: { auth: AuthState }) => !!state.auth.user;
export const selectLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;