import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Folder } from "../../types/vault";
import { RootState } from "../store";

// Define the FolderState type
interface FolderState {
  folders: Folder | null;
  loading: boolean;
  error: string | null;
}

const initialState: FolderState = {
  folders: null,
  loading: false,
  error: null,
};

const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    clearFolders: () => initialState,
    updateAllFolders: (state, action: PayloadAction<Folder | null>) => {
      state.folders = action.payload;
    },
    updateLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateFolderSlice: (_, action: PayloadAction<FolderState>) => {
      return action.payload;
    },
  },
});
export const {
  clearFolders,
  updateAllFolders,
  updateLoading,
  updateError,
  updateFolderSlice,
} = folderSlice.actions;

export const selectFolder = (state: RootState) => state.folder;

export default folderSlice.reducer;
