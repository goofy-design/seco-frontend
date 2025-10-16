import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./../../utils/axios";
import API_CONSTANTS from "./../../utils/apiConstants";

// create interface for above data structure
export interface IEventApplication {
  id: string;
  applied_date: string;
  status: string;
  judge_comment: string | null;
  judge_id: string | null;
  event_id: string;
  user_id: string;
  final_score: number | null;
  user: {
    id: string;
    created_at: string;
    name: string;
    email: string;
    password: string;
    role: string;
    reset_password_token: string | null;
    reset_password_expires: string | null;
    updated_at: string;
    auth_type: string;
    status: string;
  };
  eventsDetails: Array<{
    id: string;
    title: string;
    description: string;
    start_date: string;
    type: string;
    location: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    website: string;
    banner: string;
    judges_emails: string[];
    stages: Array<{
      id: string;
      name: string;
      description: string;
      start_date: string;
      start_time: string;
    }>;
    coordinates: [number, number];
    evaluation_criteria: any[];
  }>;
  response: Array<{
    id: string;
    user_id: string;
    event_id: string;
    submitted_at: string;
    question: string;
    answer: string | null; // can be null for file type
    application_id: string;
    type: "textarea" | "file" | "text";
    files?: string[]; // only for file type
    filesData?: {
      id: string;
      name: string;
      storage_path: string;
    }[];
    folders?: string[]; // only for file type
    foldersData?: {
      id: string;
      name: string;
    }[];
  }>;
}
// interface IEventApplication {
//   id?: string;
//   response_id: string;
//   applied_date?: string;
//   status: 'Submitted' | 'Not-Submitted' | 'Reviewing' | 'Accepted' | 'Rejected';
//   documents?: string[];
//   project_description?: string;
//   event_name?: string;
//   event_id: string;
//   user_id: string;
// }
interface EventApplicationState {
  eventApplications: IEventApplication[];
  selectedEventApplication: IEventApplication | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  previousEventApplications: IEventApplication[];
  previousSelectedEventApplication: IEventApplication | null;
}

const initialState: EventApplicationState = {
  eventApplications: [],
  selectedEventApplication: null,
  loading: false,
  error: null,
  success: null,
  previousEventApplications: [],
  previousSelectedEventApplication: null,
};

export const fetchEventApplications = createAsyncThunk(
  "eventApplication/fetchEventApplications",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_ALL_EVENT_APPLICATIONS(id)
      );

      return response.data.applications || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch event applications"
      );
    }
  }
);

export const fetchEventApplicationByResponse = createAsyncThunk(
  "eventApplication/fetchEventApplicationByResponse",
  async (responseId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_EVENT_APPLICATION_BY_RESPONSE(responseId)
      );
      return response.data.application;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch event application by response"
      );
    }
  }
);

export const fetchEventApplicationsByStatus = createAsyncThunk(
  "eventApplication/fetchEventApplicationsByStatus",
  async (status: IEventApplication["status"], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_EVENT_APPLICATIONS_BY_STATUS(status)
      );
      return response.data.applications || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch event applications by status"
      );
    }
  }
);

export const fetchEventApplicationById = createAsyncThunk(
  "eventApplication/fetchEventApplicationById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_EVENT_APPLICATION_BY_ID(id)
      );
      return response.data.application;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch event application details"
      );
    }
  }
);

export const createEventApplication = createAsyncThunk(
  "eventApplication/createEventApplication",
  async (
    applicationData: {
      response_id: string;
      status: IEventApplication["status"];
      documents?: string[];
      project_description?: string;
      event_id: string;
      user_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        API_CONSTANTS.CREATE_EVENT_APPLICATION,
        applicationData
      );
      return response.data.application;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create event application"
      );
    }
  }
);

export const updateEventApplication = createAsyncThunk(
  "eventApplication/updateEventApplication",
  async (
    {
      id,
      updatedData,
    }: {
      id: string;
      updatedData: {
        status?: IEventApplication["status"];
        documents?: string[];
        project_description?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        API_CONSTANTS.EDIT_EVENT_APPLICATION(id),
        updatedData
      );
      return response.data.application;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update event application"
      );
    }
  }
);

export const deleteEventApplication = createAsyncThunk(
  "eventApplication/deleteEventApplication",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_CONSTANTS.DELETE_EVENT_APPLICATION(id));
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete event application"
      );
    }
  }
);

const eventApplicationSlice = createSlice({
  name: "eventApplication",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },

    clearSelectedEventApplication: (state) => {
      state.selectedEventApplication = null;
    },

    setSelectedEventApplication: (state, action) => {
      state.selectedEventApplication = action.payload;
    },

    resetEventApplicationState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.eventApplications = action.payload;
        state.error = null;
      })
      .addCase(fetchEventApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEventApplicationByResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventApplicationByResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEventApplication = action.payload;
        state.error = null;
      })
      .addCase(fetchEventApplicationByResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEventApplicationsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventApplicationsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.eventApplications = action.payload;
        state.error = null;
      })
      .addCase(fetchEventApplicationsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEventApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEventApplication = action.payload;
        state.error = null;
      })
      .addCase(fetchEventApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createEventApplication.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        const tempApplication: IEventApplication = {
          id: `temp-${Date.now()}`,
          applied_date: new Date().toISOString(),
          status: action.meta.arg.status,
          judge_comment: null,
          judge_id: null,
          event_id: action.meta.arg.event_id || "",
          user_id: action.meta.arg.user_id || "",
          final_score: null,
          user: {
            id: "",
            created_at: "",
            name: "",
            email: "",
            password: "",
            role: "",
            reset_password_token: null,
            reset_password_expires: null,
            updated_at: "",
            auth_type: "",
            status: "",
          },
          eventsDetails: [],
          response: [],
        };
        state.eventApplications.push(tempApplication);
      })
      .addCase(createEventApplication.fulfilled, (state, action) => {
        state.loading = false;
        const tempIndex = state.eventApplications.findIndex((app) =>
          app.id?.startsWith("temp-")
        );
        if (tempIndex !== -1) {
          state.eventApplications[tempIndex] = action.payload;
        }
        state.success = "Event application created successfully";
        state.error = null;
      })
      .addCase(createEventApplication.rejected, (state, action) => {
        state.loading = false;
        state.eventApplications = state.eventApplications.filter(
          (app) => !app.id?.startsWith("temp-")
        );
        state.error = action.payload as string;
        state.success = null;
      })

      .addCase(updateEventApplication.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.previousEventApplications = [...state.eventApplications];
        state.previousSelectedEventApplication = state.selectedEventApplication
          ? { ...state.selectedEventApplication }
          : null;
        const index = state.eventApplications.findIndex(
          (app) => app.id === action.meta.arg.id
        );
        if (index !== -1) {
          state.eventApplications[index] = {
            ...state.eventApplications[index],
            ...action.meta.arg.updatedData,
          };
        }
        if (
          state.selectedEventApplication &&
          state.selectedEventApplication.id === action.meta.arg.id
        ) {
          state.selectedEventApplication = {
            ...state.selectedEventApplication,
            ...action.meta.arg.updatedData,
          };
        }
      })
      .addCase(updateEventApplication.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.eventApplications.findIndex(
          (app) => app.id === action.payload.id
        );
        if (index !== -1) {
          state.eventApplications[index] = action.payload;
        }
        if (
          state.selectedEventApplication &&
          state.selectedEventApplication.id === action.payload.id
        ) {
          state.selectedEventApplication = action.payload;
        }
        state.success = "Event application updated successfully";
        state.error = null;
        state.previousEventApplications = [];
        state.previousSelectedEventApplication = null;
      })
      .addCase(updateEventApplication.rejected, (state, action) => {
        state.loading = false;
        state.eventApplications = [...state.previousEventApplications];
        state.selectedEventApplication = state.previousSelectedEventApplication
          ? { ...state.previousSelectedEventApplication }
          : null;
        state.error = action.payload as string;
        state.success = null;
        state.previousEventApplications = [];
        state.previousSelectedEventApplication = null;
      })

      .addCase(deleteEventApplication.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.previousEventApplications = [...state.eventApplications];
        state.previousSelectedEventApplication = state.selectedEventApplication
          ? { ...state.selectedEventApplication }
          : null;
        state.eventApplications = state.eventApplications.filter(
          (app) => app.id !== action.meta.arg
        );
        if (
          state.selectedEventApplication &&
          state.selectedEventApplication.id === action.meta.arg
        ) {
          state.selectedEventApplication = null;
        }
      })
      .addCase(deleteEventApplication.fulfilled, (state) => {
        state.loading = false;
        state.success = "Event application deleted successfully";
        state.error = null;
        state.previousEventApplications = [];
        state.previousSelectedEventApplication = null;
      })
      .addCase(deleteEventApplication.rejected, (state, action) => {
        state.loading = false;
        state.eventApplications = [...state.previousEventApplications];
        state.selectedEventApplication = state.previousSelectedEventApplication
          ? { ...state.previousSelectedEventApplication }
          : null;
        state.error = action.payload as string;
        state.success = null;
        state.previousEventApplications = [];
        state.previousSelectedEventApplication = null;
      });
  },
});

export const {
  clearMessages,
  clearSelectedEventApplication,
  setSelectedEventApplication,
  resetEventApplicationState,
} = eventApplicationSlice.actions;

export const selectEventApplications = (state: {
  eventApplication: EventApplicationState;
}) => state.eventApplication.eventApplications;
export const selectSelectedEventApplication = (state: {
  eventApplication: EventApplicationState;
}) => state.eventApplication.selectedEventApplication;
export const selectEventApplicationLoading = (state: {
  eventApplication: EventApplicationState;
}) => state.eventApplication.loading;
export const selectEventApplicationError = (state: {
  eventApplication: EventApplicationState;
}) => state.eventApplication.error;
export const selectEventApplicationSuccess = (state: {
  eventApplication: EventApplicationState;
}) => state.eventApplication.success;

export default eventApplicationSlice.reducer;
