// projectsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectsState {
  currentProject: any | null;
  pathHistory: any[];
  files: any[];
  loading: boolean;
  formData: {
    name: string;
    website: string;
    linkedin: string;
    twitter: string;
    store_link: string;
  };
  isEditModalOpen: boolean;
  isNewProjectModalOpen: boolean;
  selectedProject: any | null;
  isDetailModalOpen: boolean;
}

const initialState: ProjectsState = {
  currentProject: null,
  pathHistory: [],
  files: [],
  loading: false,
  formData: {
    name: "",
    website: "",
    linkedin: "",
    twitter: "",
    store_link: ""
  },
  isEditModalOpen: false,
  isNewProjectModalOpen: false,
  selectedProject: null,
  isDetailModalOpen: false
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCurrentProject(state, action: PayloadAction<any | null>) {
      state.currentProject = action.payload;
    },
    setPathHistory(state, action: PayloadAction<any[]>) {
      state.pathHistory = action.payload;
    },
    setFiles(state, action: PayloadAction<any[]>) {
      state.files = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFormData(
      state,
      action: PayloadAction<Partial<ProjectsState["formData"]>>
    ) {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData(state) {
      state.formData = initialState.formData;
    },
    addToPathHistory(state, action: PayloadAction<any>) {
      if (
        state.pathHistory.length === 0 ||
        state.pathHistory[state.pathHistory.length - 1].id !== action.payload.id
      ) {
        state.pathHistory = [...state.pathHistory, action.payload];
      }
    },
    truncatePathHistory(state, action: PayloadAction<number>) {
      state.pathHistory = state.pathHistory.slice(0, action.payload + 1);
    },
    setIsEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isEditModalOpen = action.payload;
    },
    setIsNewProjectModalOpen(state, action: PayloadAction<boolean>) {
      state.isNewProjectModalOpen = action.payload;
    },
    setSelectedProject(state, action: PayloadAction<any | null>) {
      state.selectedProject = action.payload;
    },
    setIsDetailModalOpen(state, action: PayloadAction<boolean>) {
      state.isDetailModalOpen = action.payload;
    }
  }
});

export const {
  setCurrentProject,
  setPathHistory,
  setFiles,
  setLoading,
  setFormData,
  resetFormData,
  addToPathHistory,
  truncatePathHistory,
  setIsEditModalOpen,
  setIsNewProjectModalOpen,
  setIsDetailModalOpen
} = projectsSlice.actions;

export default projectsSlice.reducer;
