import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventInterface } from "@/types/event";
import { RootState } from "../store";

// Initial state

interface Event {
  status: string | null;
  data: EventInterface[] | null;
  loading: boolean | null;
}

const initialState: Event = {
  status: null,
  data: null,
  loading: null,
};

// creating the event slice
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<EventInterface>) => {
      if (state.data) {
        state.data.push(action.payload);
      } else {
        state.data = [action.payload];
      }
    },
    updateStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    updateLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearEvent: (state) => {
      state.status = null;
      state.data = null;
      state.loading = null;
    },
    updateEvents: (state, action: PayloadAction<EventInterface[]>) => {
      state.data = action.payload;
    },
    updateEventSlice: (
      state,
      action: PayloadAction<{
        status?: string | null;
        data?: EventInterface[] | null;
        loading?: boolean | null;
      }>
    ) => {
      const { status, data, loading } = action.payload;
      if (status !== undefined) {
        state.status = status;
      }
      if (data !== undefined) {
        state.data = data;
      }
      if (loading !== undefined) {
        state.loading = loading;
      }
    },
  },
});

export const {
  addEvent,
  updateStatus,
  updateLoading,
  clearEvent,
  updateEvents,
  updateEventSlice,
} = eventSlice.actions;

export const selectEvents = (state: RootState) => state.event;

export default eventSlice.reducer;
