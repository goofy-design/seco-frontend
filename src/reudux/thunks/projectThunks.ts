// projectsThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import API_CONSTANTS from "@/utils/apiConstants";
import { RootState } from "../store";
import {
  setCurrentProject,
  setFiles,
  addToPathHistory,
  resetFormData
} from "../slices/projectSlice";

export const fetchProjectDetails = createAsyncThunk(
  "projects/fetchDetails",
  async (projectId: string, { dispatch }) => {
    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_PROJECT_BY_ID(projectId)
      );

      if (response.data) {
        const newProject = response.data.data[0];
        dispatch(setCurrentProject(newProject));
        dispatch(addToPathHistory(newProject));
        const files = JSON.parse(newProject.file_ids || "[]");
        dispatch(setFiles(files));
        return newProject;
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      throw error;
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { formData } = state.projects;
    const { currentProject } = state.projects;

    try {
      const response = await axiosInstance.post(API_CONSTANTS.CREATE_PROJECT, {
        ...formData,
        parent_id: currentProject?.id || null
      });

      if (response.data) {
        dispatch(resetFormData());
        return response.data;
      }
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async (projectId: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { formData } = state.projects;
    const { currentProject } = state.projects;

    try {
      const response = await axiosInstance.put(
        API_CONSTANTS.EDIT_PROJECT(projectId),
        {
          ...formData,
          parent_id: currentProject?.id || null
        }
      );

      if (response.data) {
        dispatch(resetFormData());
        return response.data;
      }
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }
);

export const uploadFile = createAsyncThunk(
  "projects/uploadFile",
  async (file: File, { getState }) => {
    const state = getState() as RootState;
    const projectId = state.projects.currentProject?.id || "0";

    const formData = new FormData();
    formData.append("banner", file);

    try {
      const response = await axiosInstance.post(
        API_CONSTANTS.FILE_UPLOAD_PROJECT(projectId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
);

export const deleteFile = createAsyncThunk(
  "projects/deleteFile",
  async (fileUrl: string, { getState }) => {
    const state = getState() as RootState;
    const projectId = state.projects.currentProject?.id || "0";

    try {
      const response = await axiosInstance.delete(
        `${API_CONSTANTS.FILE_DELETE_PROJECT(projectId)}`,
        {
          data: { fileUrl }
        }
      );

      if (response.data && response.data.success) {
        return { fileUrl };
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
);
export const getProjectDetails = createAsyncThunk(
  "projects/getDetails",
  async (projectId: string, { dispatch }) => {
    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_PROJECT_BY_ID(projectId)
      );

      if (response.data) {
        const newProject = response.data.data[0];
        const files = JSON.parse(newProject.file_ids || "[]");
        dispatch(setCurrentProject(newProject));
        dispatch(setFiles(files));
        dispatch(addToPathHistory(newProject));
        return { project: newProject, files };
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      throw error;
    }
  }
);
