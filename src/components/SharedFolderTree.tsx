import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileItem, Folder } from "@/types/vault";
import axiosInstance from "../utils/axios";

interface SharedFolderTreeProps {
  folderId: string;
  onFileClick?: (file: FileItem) => void;
  onFolderClick?: (folder: Folder) => void;
  className?: string;
  showFileActions?: boolean;
  allowDownload?: boolean;
  title?: string;
}

interface ProjectProps {
  onClick: (folder: Folder) => void;
  onDetailClick?: (folder: Folder) => void;
  folder: Folder;
  showActions?: boolean;
}

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

const SharedFolderTree: React.FC<SharedFolderTreeProps> = ({
  folderId,
  onFileClick,
  onFolderClick,
  className = "",
  showFileActions = true,
  allowDownload = true,
  title,
}) => {
  const [rootFolder, setRootFolder] = useState<Folder | null>(null);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [path, setPath] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailFolder, setDetailFolder] = useState<Folder | null>(null);

  // Fetch the complete folder tree from API
  const fetchFolderTree = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/vault/folder/tree-from/${id}`);
      const data: Folder = response.data;
      setRootFolder(data);
      setCurrentFolder(data);
      setPath([data]);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch folder tree";
      setError(errorMessage);
      console.error("Error fetching folder tree:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (folderId) {
      fetchFolderTree(folderId);
    }
  }, [folderId]);

  const handleProjectClick = (folder: Folder) => {
    setCurrentFolder(folder);
    const formattedPath = [...path, folder];
    setPath(formattedPath);
    onFolderClick?.(folder);
  };

  const handlePathClick = (index: number) => {
    if (index < path.length) {
      const selectedFolder = path[index];
      setCurrentFolder(selectedFolder);
      const updatedPath = path.slice(0, index + 1);
      setPath(updatedPath);
      onFolderClick?.(selectedFolder);
    }
  };

  const handleDetailClick = (folder: Folder) => {
    setDetailFolder(folder);
    setIsDetailModalOpen(true);
  };

  const onCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailFolder(null);
  };

  const handleFileClick = (file: FileItem) => {
    if (onFileClick) {
      onFileClick(file);
    } else if (allowDownload) {
      downloadDocument(file);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex-1 overflow-y-auto p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading folder tree...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex-1 overflow-y-auto p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto h-8 w-8"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <p className="text-red-600 font-medium">Error loading folder</p>
            <p className="text-muted-foreground text-sm">{error}</p>
            <button
              onClick={() => fetchFolderTree(folderId)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!rootFolder || !currentFolder) {
    return (
      <div className={`flex-1 overflow-y-auto p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No folder data available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex-1 overflow-y-auto p-6 ${className}`}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {title || rootFolder.name}
              </h1>
              <p className="text-muted-foreground">
                Browse and access shared folder contents
              </p>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div>
            <div className="flex items-center justify-between gap-3 overflow-x-auto py-2 mb-4 text-sm">
              {path.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center">
                  {index > 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-right h-4 w-4 mx-2 text-gray-400"
                    >
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  )}
                  <button
                    onClick={() => handlePathClick(index)}
                    className={`justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:text-accent-foreground h-10 flex items-center px-2 py-1 hover:bg-gray-100 ${
                      index === path.length - 1 ? "text-blue-600" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-folder h-4 w-4 mr-1"
                    >
                      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                    </svg>
                    {item.name}
                  </button>
                </div>
              ))}
              <div
                onClick={() => {
                  handleDetailClick(currentFolder);
                }}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                Details
              </div>
            </div>

            {/* Folder Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {currentFolder.children && currentFolder.children.length > 0 ? (
                currentFolder.children.map((subFolder) => (
                  <SharedProject
                    key={subFolder.id}
                    folder={subFolder}
                    onClick={handleProjectClick}
                    onDetailClick={handleDetailClick}
                    showActions={showFileActions}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto h-12 w-12"
                    >
                      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                    </svg>
                  </div>
                  <p className="text-muted-foreground">No folders found</p>
                </div>
              )}
            </div>

            {/* Files Table */}
            {currentFolder.files && currentFolder.files.length > 0 && (
              <SharedFileTabs
                files={currentFolder.files}
                onFileClick={handleFileClick}
                showActions={showFileActions}
                allowDownload={allowDownload}
              />
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {isDetailModalOpen && (
        <ProjectDetailsModal
          isOpen={isDetailModalOpen}
          onClose={onCloseDetailModal}
          folder={detailFolder}
        />
      )}
    </>
  );
};

const SharedProject: React.FC<ProjectProps> = ({
  onClick,
  onDetailClick,
  folder,
  showActions = true,
}) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3"
        onClick={() => onClick(folder)}
      >
        <div className="bg-blue-100 p-2 rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-folder h-6 w-6 text-blue-600"
          >
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{folder.name}</h3>
          <p className="text-xs text-gray-500">
            Created on {formatDate(folder.created_at)}
          </p>
        </div>
      </div>
      {showActions && onDetailClick && (
        <div className="border-t px-4 py-2 flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetailClick(folder);
            }}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          >
            Details
          </button>
        </div>
      )}
    </div>
  );
};

interface SharedFileTabsProps {
  files: FileItem[];
  onFileClick: (file: FileItem) => void;
  showActions?: boolean;
  allowDownload?: boolean;
}

const SharedFileTabs: React.FC<SharedFileTabsProps> = ({
  files,
  onFileClick,
  showActions = true,
  allowDownload = true,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);

  const filterFiles = (files: FileItem[], type: string) => {
    if (type === "all") return files;
    if (type === "pdf") return files.filter((f) => f.file_type.includes("pdf"));
    if (type === "excel")
      return files.filter(
        (f) =>
          f.file_type.includes("spreadsheet") || f.file_type.includes("excel")
      );
    if (type === "presentation")
      return files.filter((f) => f.file_type.includes("presentation"));
    if (type === "document")
      return files.filter(
        (f) => f.file_type.includes("word") || f.file_type.includes("text")
      );
    if (type === "media")
      return files.filter(
        (f) =>
          f.file_type.startsWith("video") ||
          f.file_type.startsWith("image") ||
          f.file_type.startsWith("audio")
      );
    return [];
  };

  useEffect(() => {
    setFilteredFiles(filterFiles(files || [], activeTab));
  }, [files, activeTab]);

  const tabs = [
    { key: "all", label: "All Files" },
    { key: "pdf", label: "PDFs" },
    { key: "excel", label: "Spreadsheets" },
    { key: "presentation", label: "Presentations" },
    { key: "document", label: "Documents" },
    { key: "media", label: "Media" },
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <div
          role="tablist"
          className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              onClick={() => setActiveTab(tab.key)}
              aria-selected={activeTab === tab.key}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        tabIndex={0}
        className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-0"
      >
        <div className="overflow-x-auto">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground w-[400px]">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Size
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Date Added
                  </th>
                  {showActions && (
                    <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length === 0 ? (
                  <tr className="border-b">
                    <td
                      colSpan={showActions ? 5 : 4}
                      className="p-4 text-center text-muted-foreground py-8"
                    >
                      <span className="block">No files found</span>
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map((file, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="h-12 px-4">{file.name}</td>
                      <td className="h-12 px-4">{file.file_type}</td>
                      <td className="h-12 px-4">{formatFileSize(file.size)}</td>
                      <td className="h-12 px-4">
                        {formatDate(file.created_at)}
                      </td>
                      {showActions && (
                        <td className="h-12 px-4 text-right">
                          <button
                            onClick={() => onFileClick(file)}
                            className="inline-flex items-center rounded-md border bg-background hover:bg-accent h-8 px-3 text-sm"
                          >
                            {allowDownload ? "View/Download" : "View"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  folder,
}) => {
  if (!isOpen || !folder) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{folder.name}</h2>
        {Object.keys(folder.meta_data || {}).length > 0 ? (
          <div className="space-y-2 text-sm text-gray-800 p-4 bg-gray-100 border rounded">
            {Object.entries(folder.meta_data).map(([key, value], index) => (
              <p key={index}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        ) : (
          <span>No details about {folder.name}...</span>
        )}
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Helper functions
const downloadDocument = (file: FileItem) => {
  try {
    window.open(file.storage_path, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Failed to open file. Please try again.");
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const kb = 1024;
  const mb = kb * 1024;
  if (bytes < mb) return `${(bytes / kb).toFixed(2)} KB`;
  return `${(bytes / mb).toFixed(2)} MB`;
};

export default SharedFolderTree;
