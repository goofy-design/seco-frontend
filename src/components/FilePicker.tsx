import React, { useState } from "react";
import { Folder, FileText, Upload } from "lucide-react";
import FolderTree from "./FolderTree";
import axiosInstance from "../utils/axios";
import API_CONSTANTS from "../utils/apiConstants";
import { toast } from "sonner";

interface FilePickerProps {
  fieldId: string;
  vault: any;
  selectedFolders: string[];
  selectedFiles: string[];
  onSelectionChange: (
    fieldId: string,
    folders: string[],
    files: string[]
  ) => void;
  error?: string;
  onDataRefresh?: () => void;
}

const FilePicker: React.FC<FilePickerProps> = ({
  fieldId,
  vault,
  selectedFolders,
  selectedFiles,
  onSelectionChange,
  onDataRefresh,
}) => {
  const [showDocumentsPanel, setShowDocumentsPanel] = useState(false);
  const [uploading, setUploading] = useState(false);
  const getAllFiles = (folder: any) => {
    let allFiles: Array<{
      id: string;
      name: string;
      size: number;
      file_type: string;
    }> = [];

    if (folder?.files) {
      allFiles = [...allFiles, ...folder.files];
    }

    if (folder?.children) {
      folder.children.forEach((child: any) => {
        allFiles = [...allFiles, ...getAllFiles(child)];
      });
    }
    return allFiles;
  };

  const getAllFilesInFolder = (folder: any): string[] => {
    let fileIds: string[] = [];

    if (folder.files) {
      fileIds = [...fileIds, ...folder.files.map((file: any) => file.id)];
    }

    if (folder.children) {
      folder.children.forEach((child: any) => {
        fileIds = [...fileIds, ...getAllFilesInFolder(child)];
      });
    }

    return fileIds;
  };

  const getAllSubFolders = (folder: any): string[] => {
    let folderIds: string[] = [];

    if (folder.children) {
      folder.children.forEach((child: any) => {
        folderIds.push(child.id);
        folderIds = [...folderIds, ...getAllSubFolders(child)];
      });
    }

    return folderIds;
  };

  const handleFolderSelect = (folder: any, isChecked: boolean) => {
    let newSelectedFolders: string[];

    if (isChecked) {
      newSelectedFolders = [...selectedFolders, folder.id];
    } else {
      newSelectedFolders = selectedFolders.filter((id) => id !== folder.id);
    }

    onSelectionChange(fieldId, newSelectedFolders, selectedFiles);
  };

  const handleFileSelect = (fileId: string, isChecked: boolean) => {
    let newSelectedFiles: string[];

    if (isChecked) {
      newSelectedFiles = [...selectedFiles, fileId];
    } else {
      newSelectedFiles = selectedFiles.filter((id) => id !== fileId);
    }

    onSelectionChange(fieldId, selectedFolders, newSelectedFiles);
  };

  const handleFileUpload = async () => {
    setUploading(true);
    try {
      const fileInput = document.getElementById(
        `file-picker-input-${fieldId}`
      ) as HTMLInputElement;

      const selectedFiles = fileInput?.files;
      if (!selectedFiles || selectedFiles.length === 0) {
        toast.error("No files selected");
        setUploading(false);
        return;
      }

      // Check for duplicate files in root folder
      const rootFolder = vault.folders;
      const duplicateFiles = Array.from(selectedFiles).filter((file) =>
        rootFolder?.files?.some(
          (existingFile: any) => existingFile.name.trim() === file.name.trim()
        )
      );

      if (duplicateFiles.length > 0) {
        toast.error(
          `File(s) already exist: ${duplicateFiles
            .map((f) => f.name)
            .join(", ")}`
        );
        setUploading(false);
        return;
      }

      const user = localStorage.getItem("user");
      const userId = JSON.parse(user || "{}").id;

      // Upload files sequentially or in parallel
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const formDataToSend = new FormData();
        formDataToSend.append("file", file);
        formDataToSend.append("folderId", vault.folders?.id || "-1"); // Upload to root folder
        formDataToSend.append("userId", userId || "-1");

        return axiosInstance.post(API_CONSTANTS.UPLOAD_FILE, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      });

      // Wait for all uploads to complete
      const results = await Promise.allSettled(uploadPromises);

      const successCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failedCount = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (successCount > 0) {
        // Clear the file input
        fileInput.value = "";

        // Call API to refresh data
        if (onDataRefresh) {
          await onDataRefresh();
        }

        if (failedCount === 0) {
          toast.success(`${successCount} file(s) uploaded successfully!`);
        } else {
          toast.success(
            `${successCount} file(s) uploaded successfully, ${failedCount} failed.`
          );
        }
      }

      if (failedCount > 0 && successCount === 0) {
        toast.error("All file uploads failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const isFileSelected = (fileId: string) => {
    return selectedFiles.includes(fileId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <div className="w-4 h-4 text-green-500">📷</div>;
    } else if (fileType.includes("pdf")) {
      return <div className="w-4 h-4 text-red-500">📄</div>;
    } else if (fileType.includes("document") || fileType.includes("word")) {
      return <div className="w-4 h-4 text-blue-500">📝</div>;
    }
    return <div className="w-4 h-4 text-gray-500">📄</div>;
  };

  const allFiles = getAllFiles(vault.folders);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Choose relevant folders or documents to include with your application.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        {/* Header with tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex">
              <button
                onClick={() => setShowDocumentsPanel(false)}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  !showDocumentsPanel
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Folder className="w-4 h-4 inline mr-2" />
                Project Folders
              </button>
              <button
                onClick={() => setShowDocumentsPanel(true)}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  showDocumentsPanel
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                All Documents ({allFiles.length})
              </button>
            </div>

            {/* Upload button - always visible */}
            <div className="px-4 py-3">
              <button
                onClick={() => {
                  document
                    .getElementById(`file-picker-input-${fieldId}`)
                    ?.click();
                }}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Files"}
              </button>
              <input
                id={`file-picker-input-${fieldId}`}
                type="file"
                accept="*/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {!showDocumentsPanel ? (
            /* Folder structure view */
            <div className="space-y-2">
              {vault.folders && (
                <FolderTree
                  folder={vault.folders}
                  selectedFolders={selectedFolders}
                  selectedFiles={selectedFiles}
                  onFolderSelect={handleFolderSelect}
                  onFileSelect={handleFileSelect}
                />
              )}
            </div>
          ) : (
            /* All documents view */
            <div className="space-y-2">
              <div className="text-sm text-gray-600 mb-3">
                All files from all folders:
              </div>
              {allFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No documents found.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Upload files to get started.
                  </p>
                </div>
              ) : (
                allFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={isFileSelected(file.id)}
                      onChange={(e) =>
                        handleFileSelect(file.id, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    {getFileIcon(file.file_type)}
                    <div className="flex-1">
                      <span className="text-sm text-gray-700 font-medium">
                        {file.name}
                      </span>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.file_type}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {(selectedFolders.length > 0 || selectedFiles.length > 0) && (
          <div className="bg-blue-50 border-t border-gray-200 p-3">
            <p className="text-sm text-blue-800">
              Selected: {selectedFolders.length} folders, {selectedFiles.length}{" "}
              files
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePicker;
