import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_CONSTANTS from "../../utils/apiConstants";
import { RootState } from "./../store";
import axiosInstance from "@/utils/axios";

export interface IAccount {
  id: string;
  company_description: string;
  company_name: string;
  website: string;
  avatar_url: string;
  full_name: string;
  location: string;
  date: string;
  industry: string;
  email_notification: boolean;
  new_event_notification: boolean;
  showInvestors: boolean;
  // Investor profile fields
  availability?: "Available" | "Unavailable";
  bio?: string;
  sectors?: string[];
  expertise?: string[];
  specialization?: string;
  experience?: string;
  image?: string;
  linkedin?: string;
}

interface AccountState {
  currentAccount: IAccount | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AccountState = {
  currentAccount: null,
  loading: false,
  error: null,
  success: false,
};

export const fetchAccountById = createAsyncThunk<
  IAccount,
  string,
  { state: RootState }
>("account/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      API_CONSTANTS.FIND_ACCOUNT_BY_ID(id),
      {}
    );
    return response.data.account;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.details || error.message);
  }
});

export const createAccount = createAsyncThunk<
  IAccount,
  IAccount,
  { state: RootState }
>("account/create", async (accountData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(API_CONSTANTS.CREATE_ACCOUNT, {
      ...accountData,
    });
    return response.data.account;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.details || error.message);
  }
});

export const updateAccount = createAsyncThunk<
  IAccount,
  { id: string; accountData: Partial<IAccount> },
  { state: RootState }
>("account/update", async ({ id, accountData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(
      API_CONSTANTS.EDIT_ACCOUNT_BY_ID(id),
      { ...accountData }
    );
    return response.data.account;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.details || error.message);
  }
});

export const updateNotificationSettings = createAsyncThunk<
  IAccount,
  { id: string; email_notification: boolean; new_event_notification: boolean },
  { state: RootState }
>(
  "account/updateNotifications",
  async (
    { id, email_notification, new_event_notification },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(
        API_CONSTANTS.EDIT_ACCOUNT_BY_ID(id),
        { email_notification, new_event_notification }
      );
      return response.data.account;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.details || error.message);
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    resetAccountState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAccountError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch account cases
      .addCase(fetchAccountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccount = action.payload;
        state.error = null;
      })
      .addCase(fetchAccountById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create account cases
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccount = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Update account cases
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccount = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Update notifications cases
      .addCase(updateNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccount = action.payload;
        state.success = true;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAccountState, clearAccountError } = accountSlice.actions;

export default accountSlice.reducer;
