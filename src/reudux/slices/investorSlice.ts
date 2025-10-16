import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./../../utils/axios";
import API_CONSTANTS from "./../../utils/apiConstants";

// Define the Investor type based on the schema
interface Investor {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  location: string;
  availability: string;
  bio: string;
  sectors: string[];
  expertise: string[];
  specialization: string;
  experience: string;
  image: string;
}

// Define the state shape
interface InvestorState {
  investors: Investor[];
  selectedInvestor: Investor | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  // storing previous state for reverting optimistic updates if the operation fails then
  previousInvestors: Investor[];
  previousSelectedInvestor: Investor | null;
}

// Initial state
const initialState: InvestorState = {
  investors: [],
  selectedInvestor: null,
  loading: false,
  error: null,
  success: null,
  previousInvestors: [],
  previousSelectedInvestor: null,
};

// fetched all investors
export const fetchInvestors = createAsyncThunk(
  "investor/fetchInvestors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_ALL_INVESTORS);
      return response.data.investors || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch investors"
      );
    }
  }
);

// export const fetchInvestorById = createAsyncThunk(
//   'investor/fetchInvestorById',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(API_CONSTANTS.GET_INVESTOR_BY_ID(id));
//       return response.data.investor;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.error || err.response?.data?.message || 'Failed to fetch investor details'
//       );
//     }
//   }
// );

// creates a new investor
// export const createInvestor = createAsyncThunk(
//   'investor/createInvestor',
//   async (
//     investorData: {
//       name: string;
//       email: string;
//       password: string;
//       company: string;
//       role: string;
//       location: string;
//       availability: string;
//       bio: string;
//       sectors: string[];
//       expertise: string[];
//       specialization: string;
//       experience: string;
//       image?: File | null;
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append('name', investorData.name);
//       formDataToSend.append('email', investorData.email);
//       formDataToSend.append('password', investorData.password);
//       formDataToSend.append('company', investorData.company);
//       formDataToSend.append('role', investorData.role);
//       formDataToSend.append('location', investorData.location);
//       formDataToSend.append('availability', investorData.availability);
//       formDataToSend.append('bio', investorData.bio);
//       formDataToSend.append('sectors', JSON.stringify(investorData.sectors));
//       formDataToSend.append('expertise', JSON.stringify(investorData.expertise));
//       formDataToSend.append('specialization', investorData.specialization);
//       formDataToSend.append('experience', investorData.experience);

//       if (investorData.image) {
//         formDataToSend.append('image', investorData.image);
//       }

//       const response = await axiosInstance.post(
//         API_CONSTANTS.CREATE_INVESTOR,
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       return response.data.investor;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.error || err.response?.data?.message || 'Failed to create investor'
//       );
//     }
//   }
// );

// update an investor
// export const updateInvestor = createAsyncThunk(
//   'investor/updateInvestor',
//   async (
//     {
//       id,
//       updatedData,
//     }: {
//       id: string;
//       updatedData: {
//         name?: string;
//         email?: string;
//         company?: string;
//         role?: string;
//         location?: string;
//         availability?: string;
//         bio?: string;
//         sectors?: string[];
//         expertise?: string[];
//         specialization?: string;
//         experience?: string;
//         image?: File | null;
//       };
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const formDataToSend = new FormData();

//       // Append only provided fields to FormData
//       Object.keys(updatedData).forEach((key) => {
//         const value = updatedData[key as keyof typeof updatedData];
//         if (value !== undefined && value !== null) {
//           if (key === 'sectors' || key === 'expertise') {
//             formDataToSend.append(key, JSON.stringify(value));
//           } else if (key === 'image' && value instanceof File) {
//             formDataToSend.append(key, value);
//           } else if (key !== 'image') {
//             formDataToSend.append(key, value as string);
//           }
//         }
//       });

//       const response = await axiosInstance.put(
//         API_CONSTANTS.EDIT_INVESTOR(id),
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       return response.data.investor;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.error || err.response?.data?.message || 'Failed to update investor'
//       );
//     }
//   }
// );

// delete an investor
// export const deleteInvestor = createAsyncThunk(
//   'investor/deleteInvestor',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await axiosInstance.delete(API_CONSTANTS.DELETE_INVESTOR(id));
//       return id;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.error || err.response?.data?.message || 'Failed to delete investor'
//       );
//     }
//   }
// );

// search investors
export const searchInvestors = createAsyncThunk(
  "investor/searchInvestors",
  async (
    searchParams: {
      query?: string;
      sectors?: string[];
      expertise?: string[];
      location?: string;
      availability?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (searchParams.query) {
        params.append("query", searchParams.query);
      }
      if (searchParams.sectors && searchParams.sectors.length > 0) {
        params.append("sectors", searchParams.sectors.join(","));
      }
      if (searchParams.expertise && searchParams.expertise.length > 0) {
        params.append("expertise", searchParams.expertise.join(","));
      }
      if (searchParams.location) {
        params.append("location", searchParams.location);
      }
      if (searchParams.availability) {
        params.append("availability", searchParams.availability);
      }

      const response = await axiosInstance.get(
        `${API_CONSTANTS.GET_ALL_INVESTORS}?${params.toString()}`
      );

      return response.data.investors || [];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to search investors"
      );
    }
  }
);

// creating the investor slice
const investorSlice = createSlice({
  name: "investor",
  initialState,
  reducers: {
    // Clear error and success messages
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },

    // Clear selected investor
    clearSelectedInvestor: (state) => {
      state.selectedInvestor = null;
    },

    // Set selected investor
    setSelectedInvestor: (state, action) => {
      state.selectedInvestor = action.payload;
    },

    // Reset state
    resetInvestorState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestors.fulfilled, (state, action) => {
        state.loading = false;
        state.investors = action.payload;
        state.error = null;
      })
      .addCase(fetchInvestors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // .addCase(fetchInvestorById.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchInvestorById.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.selectedInvestor = action.payload;
      //   state.error = null;
      // })
      // .addCase(fetchInvestorById.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })

      // // create investor with optimistic update
      // .addCase(createInvestor.pending, (state, action) => {
      //   state.loading = true;
      //   state.error = null;
      //   state.success = null;
      //   // optimistic update adding a temporary investor to the list
      //   const tempInvestor: Investor = {
      //     id: `temp-${Date.now()}`, // Temporary ID
      //     name: action.meta.arg.name,
      //     email: action.meta.arg.email,
      //     company: action.meta.arg.company,
      //     role: action.meta.arg.role,
      //     location: action.meta.arg.location,
      //     availability: action.meta.arg.availability,
      //     bio: action.meta.arg.bio,
      //     sectors: action.meta.arg.sectors,
      //     expertise: action.meta.arg.expertise,
      //     specialization: action.meta.arg.specialization,
      //     experience: action.meta.arg.experience,
      //     image: action.meta.arg.image ? URL.createObjectURL(action.meta.arg.image) : '',
      //   };
      //   state.investors.push(tempInvestor);
      // })
      // .addCase(createInvestor.fulfilled, (state, action) => {
      //   state.loading = false;
      //   // replacing the temporary investor with the actual one from the API
      //   const tempIndex = state.investors.findIndex((inv) => inv.id.startsWith('temp-'));
      //   if (tempIndex !== -1) {
      //     state.investors[tempIndex] = action.payload;
      //   }
      //   state.success = 'Investor created successfully';
      //   state.error = null;
      // })
      // .addCase(createInvestor.rejected, (state, action) => {
      //   state.loading = false;
      //   // Remove the temporary investor on failure
      //   state.investors = state.investors.filter((inv) => !inv.id.startsWith('temp-'));
      //   state.error = action.payload as string;
      //   state.success = null;
      // })

      // // Update investor with optimistic update
      // .addCase(updateInvestor.pending, (state, action) => {
      //   state.loading = true;
      //   state.error = null;
      //   state.success = null;
      //   // Store the previous state for reverting
      //   state.previousInvestors = [...state.investors];
      //   state.previousSelectedInvestor = state.selectedInvestor ? { ...state.selectedInvestor } : null;
      //   // Optimistic update: Update the investor in the list
      //   const index = state.investors.findIndex(
      //     (investor) => investor.id === action.meta.arg.id
      //   );
      //   if (index !== -1) {
      //     state.investors[index] = {
      //       ...state.investors[index],
      //       ...action.meta.arg.updatedData,
      //       sectors: action.meta.arg.updatedData.sectors || state.investors[index].sectors,
      //       expertise: action.meta.arg.updatedData.expertise || state.investors[index].expertise,
      //       image:
      //         action.meta.arg.updatedData.image instanceof File
      //           ? URL.createObjectURL(action.meta.arg.updatedData.image)
      //           : state.investors[index].image,
      //     };
      //   }
      //   if (state.selectedInvestor && state.selectedInvestor.id === action.meta.arg.id) {
      //     state.selectedInvestor = {
      //       ...state.selectedInvestor,
      //       ...action.meta.arg.updatedData,
      //       sectors: action.meta.arg.updatedData.sectors || state.selectedInvestor.sectors,
      //       expertise: action.meta.arg.updatedData.expertise || state.selectedInvestor.expertise,
      //       image:
      //         action.meta.arg.updatedData.image instanceof File
      //           ? URL.createObjectURL(action.meta.arg.updatedData.image)
      //           : state.selectedInvestor.image,
      //     };
      //   }
      // })
      // .addCase(updateInvestor.fulfilled, (state, action) => {
      //   state.loading = false;
      //   // Confirm the update with the actual API response
      //   const index = state.investors.findIndex(
      //     (investor) => investor.id === action.payload.id
      //   );
      //   if (index !== -1) {
      //     state.investors[index] = action.payload;
      //   }
      //   if (state.selectedInvestor && state.selectedInvestor.id === action.payload.id) {
      //     state.selectedInvestor = action.payload;
      //   }
      //   state.success = 'Investor updated successfully';
      //   state.error = null;
      //   // Clear previous state
      //   state.previousInvestors = [];
      //   state.previousSelectedInvestor = null;
      // })
      // .addCase(updateInvestor.rejected, (state, action) => {
      //   state.loading = false;
      //   // Revert the optimistic update on failure
      //   state.investors = [...state.previousInvestors];
      //   state.selectedInvestor = state.previousSelectedInvestor
      //     ? { ...state.previousSelectedInvestor }
      //     : null;
      //   state.error = action.payload as string;
      //   state.success = null;
      //   // Clear previous state
      //   state.previousInvestors = [];
      //   state.previousSelectedInvestor = null;
      // })

      // // Delete investor with optimistic update
      // .addCase(deleteInvestor.pending, (state, action) => {
      //   state.loading = true;
      //   state.error = null;
      //   state.success = null;
      //   // Store the previous state for reverting
      //   state.previousInvestors = [...state.investors];
      //   state.previousSelectedInvestor = state.selectedInvestor ? { ...state.selectedInvestor } : null;
      //   // Optimistic update: Remove the investor from the list
      //   state.investors = state.investors.filter(
      //     (investor) => investor.id !== action.meta.arg
      //   );
      //   if (state.selectedInvestor && state.selectedInvestor.id === action.meta.arg) {
      //     state.selectedInvestor = null;
      //   }
      // })
      // .addCase(deleteInvestor.fulfilled, (state) => {
      //   state.loading = false;
      //   state.success = 'Investor deleted successfully';
      //   state.error = null;

      //   state.previousInvestors = [];
      //   state.previousSelectedInvestor = null;
      // })
      // .addCase(deleteInvestor.rejected, (state, action) => {
      //   state.loading = false;
      //   // Revert the optimistic update on failure
      //   state.investors = [...state.previousInvestors];
      //   state.selectedInvestor = state.previousSelectedInvestor
      //     ? { ...state.previousSelectedInvestor }
      //     : null;
      //   state.error = action.payload as string;
      //   state.success = null;

      //   state.previousInvestors = [];
      //   state.previousSelectedInvestor = null;
      // })

      .addCase(searchInvestors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchInvestors.fulfilled, (state, action) => {
        state.loading = false;
        state.investors = action.payload;
        state.error = null;
      })
      .addCase(searchInvestors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearMessages,
  clearSelectedInvestor,
  setSelectedInvestor,
  resetInvestorState,
} = investorSlice.actions;

export const selectInvestors = (state: { investor: InvestorState }) =>
  state.investor.investors;
export const selectSelectedInvestor = (state: { investor: InvestorState }) =>
  state.investor.selectedInvestor;
export const selectInvestorLoading = (state: { investor: InvestorState }) =>
  state.investor.loading;
export const selectInvestorError = (state: { investor: InvestorState }) =>
  state.investor.error;
export const selectInvestorSuccess = (state: { investor: InvestorState }) =>
  state.investor.success;

export default investorSlice.reducer;
