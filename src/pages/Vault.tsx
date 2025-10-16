import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/reudux/store";
import axiosInstance from "../utils/axios";
import API_CONSTANTS from "../utils/apiConstants";
import { toast } from "sonner";
import { FileItem, Folder } from "@/types/vault";
import { useAppSelector } from "@/reudux/hooks/hooks";
import {
  updateAllFolders,
  updateError,
  updateLoading,
} from "@/reudux/slices/folderSlice";

interface ProjectProps {
  onEdit: (folder: Folder) => void;
  onClick: (folder: Folder) => void;
  onDetailClick: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
  folder: Folder;
}
interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
}

const Vault = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const folder = useAppSelector((state) => state.folder);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [path, setPath] = useState<Folder[]>([]);
  const [isDataFetching, setIsDataFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [extraFields, setExtraFields] = useState<Record<string, string>>({});

  const [errors, setErrors] = useState({
    name: "",
    website: "",
    linkedin: "",
    twitter: "",
    store_link: "",
    extraFields: "",
  });
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [newExtra, setNewExtra] = useState({ key: "", value: "" });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailFolder, setDetailFolder] = useState<Folder | null>(null);
  const onCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  // Improved editExtraField function
  const editExtraField = (
    prevKey: string,
    newKey: string,
    newValue: string
  ) => {
    setExtraFields((prevFields) => {
      const updatedFields = { ...prevFields };

      // If newKey and newValue are empty, remove the field
      if (newKey === "" && newValue === "") {
        delete updatedFields[prevKey];
        // Also remove from formData
        setFormData((prev) => {
          const updated = { ...prev };
          delete updated[prevKey];
          return updated;
        });
      } else {
        // Delete old key if it has changed
        if (prevKey !== newKey) {
          delete updatedFields[prevKey];
          // Remove old key from formData
          setFormData((prev) => {
            const updated = { ...prev };
            delete updated[prevKey];
            return updated;
          });
        }

        // Set new key-value pair
        if (newKey.trim() !== "") {
          updatedFields[newKey] = newValue;
          // Update formData
          setFormData((prev) => ({
            ...prev,
            [newKey]: newValue,
          }));
        }
      }

      return updatedFields;
    });
  };

  // Improved add field function
  const addExtraField = () => {
    if (newExtra.key.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        extraFields: "Key cannot be empty",
      }));
      return;
    }

    if (extraFields.hasOwnProperty(newExtra.key)) {
      setErrors((prev) => ({
        ...prev,
        extraFields: "Key already exists",
      }));
      return;
    }

    setExtraFields((prev) => ({
      ...prev,
      [newExtra.key]: newExtra.value,
    }));

    // Update formData
    setFormData((prev) => ({
      ...prev,
      [newExtra.key]: newExtra.value,
    }));

    // Reset new field inputs
    setNewExtra({ key: "", value: "" });
    setErrors((prev) => ({
      ...prev,
      extraFields: "",
    }));
  };

  const handleProjectClick = (folder: Folder) => {
    setCurrentFolder(folder);
    const formattedPath = [...path, folder];
    setPath(formattedPath);
  };

  const handlePathClick = async (index: number) => {
    setCurrentFolder(path[index]);
    const updatedPath = path.slice(0, index + 1);
    setPath(updatedPath);
  };

  const handleFileUpload = async () => {
    setLoading(true);
    try {
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;

      const selectedFiles = fileInput?.files;
      if (!selectedFiles || selectedFiles.length === 0) {
        toast.error("No files selected");
        setLoading(false);
        return;
      }

      // Check for duplicate files
      const duplicateFiles = Array.from(selectedFiles).filter((file) =>
        currentFolder?.files.some(
          (existingFile) => existingFile.name.trim() === file.name.trim()
        )
      );

      if (duplicateFiles.length > 0) {
        toast.error(
          `File(s) already exist: ${duplicateFiles
            .map((f) => f.name)
            .join(", ")}`
        );
        setLoading(false);
        return;
      }

      // Upload files sequentially or in parallel
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const formDataToSend = new FormData();
        formDataToSend.append("file", file);
        formDataToSend.append("folderId", currentFolder?.id || "-1");
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
        await fetchData(); // refresh the folder tree
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
      setLoading(false);
      // Clear the file input
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hasDuplicate = currentFolder?.children?.some(
      (child) => child.name.trim() === formData.name?.trim()
    );
    if (formData.website)
      formData.website = formData.website.startsWith("https://")
        ? formData.website
        : `https://${formData.website}`;
    if (formData.store_link)
      formData.store_link = formData.store_link.startsWith("https://")
        ? formData.store_link
        : `https://${formData.store_link}`;
    const { id, name, ...metaData } = formData;
    if (hasDuplicate && !id) {
      setErrors((prev) => ({
        ...prev,
        name: "A folder with the same name already exists.",
      }));
      toast.error(
        "A folder with the same name already exists. Please choose a different name."
      );
      return;
    }

    const payload = {
      userId: JSON.parse(localStorage.getItem("user") || "{}").id,
      name,
      parentId: currentFolder?.id || "-1",
      metaData,
    };
    try {
      let response;
      if (id) {
        response = await axiosInstance.put(
          API_CONSTANTS.EDIT_FOLDER(id),
          payload
        );
      } else {
        response = await axiosInstance.post(API_CONSTANTS.ADD_FOLDER, payload);
      }
      const data = response.data;
      if (data) {
        await fetchData(); // refresh the folder tree
        setIsNewProjectModalOpen(false);
        if (id) {
          toast.success(`${name} updated successfully!`);
        } else {
          toast.success(`${name} created successfully!`);
        }
      }
    } catch (error: any) {
      console.error("Error in handleSubmit : ", error);
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const handleEditClick = async (folder: Folder) => {
    setErrors({
      name: "",
      website: "",
      linkedin: "",
      twitter: "",
      store_link: "",
      extraFields: "",
    });
    setIsNewProjectModalOpen(true);
    const metaData = { ...folder.meta_data, name: folder.name, id: folder.id };
    setFormData(metaData);
    const { id, name, linkedin, twitter, website, store_link, ...extraFields } =
      folder.meta_data;
    setExtraFields(extraFields);
    setNewExtra({ key: "", value: "" });
  };

  const handleDetailClick = async (folder: Folder) => {
    setDetailFolder(folder);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = async (folder: Folder) => {
    try {
      const response = await axiosInstance.delete(
        API_CONSTANTS.DELETE_FOLDER(folder.id)
      );
      if (response.status === 200 || response.status === 204) {
        toast.success(`${folder.name} deleted successfully!`);
        await fetchData(); // refresh the folder tree
      }
    } catch (error: any) {
      console.error("Error deleting folder:", error);
      toast.error(error.message || "Failed to delete folder.");
    }
  };
  const user = localStorage.getItem("user");

  const userId = JSON.parse(user || "{}").id;
  const fetchData = async () => {
    dispatch(updateLoading(true));
    setIsDataFetching(true);
    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_FOLDER_TREE(userId || "")
      );
      const data: Folder = response.data;
      dispatch(updateAllFolders(data));
      const findCurrentFolder = (folder: Folder): Folder | null => {
        if (folder.id === currentFolder?.id) {
          return folder;
        }
        for (const child of folder.children) {
          const found = findCurrentFolder(child);
          if (found) {
            return found;
          }
        }
        return null;
      };
      const foundFolder = findCurrentFolder(data);
      if (currentFolder) {
        // recursively find the currentFolder id in the tree and assign the updated currentFolder

        setCurrentFolder(foundFolder || null);
      } else {
        setCurrentFolder(data);
      }
      if (path && path.length > 0) {
        const newPath = [...path.slice(0, -1), foundFolder || data];
        setPath(newPath);
      } else {
        setPath([data]);
      }
    } catch (error: any) {
      dispatch(updateError(error.message || "Failed to fetch projects"));
      console.error("Error fetching projects:", error);
    } finally {
      setIsDataFetching(false);
      dispatch(updateLoading(false));
    }
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/auth");
      return;
    }

    if (folder?.folders) {
      setCurrentFolder(folder.folders);
      setPath([folder.folders]);
    } else {
      fetchData();
    }
  }, []);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Document Vault
              </h1>
              <p className="text-muted-foreground">
                Store and manage pitch decks, videos, and other documents for
                your projects.
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => {
                  setIsNewProjectModalOpen(true);
                  setFormData({});
                  setErrors({
                    name: "",
                    website: "",
                    linkedin: "",
                    twitter: "",
                    store_link: "",
                    extraFields: "",
                  });
                  setExtraFields({});
                }}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-folder mr-2 h-4 w-4"
                >
                  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                </svg>{" "}
                New Project
              </button>
              {!isDataFetching && (
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  onClick={() => {
                    // e.stopPropagation();
                    document.getElementById("file-input")?.click();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>{" "}
                  <input
                    id="file-input"
                    type="file"
                    accept="*/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {loading ? "Uploading..." : "Upload Files"}
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center overflow-x-auto py-2 mb-4 text-sm">
              {path.map((item, index) => (
                <div key={index} className="flex items-center">
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
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-folder h-4 w-4 mr-1"
                    >
                      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                    </svg>
                    {item.name}
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {isDataFetching && <div>Loading...</div>}
              {currentFolder && currentFolder.children.length > 0 ? (
                currentFolder?.children?.map((subFolder, index) => (
                  <Project
                    key={index}
                    folder={subFolder}
                    onEdit={handleEditClick}
                    onClick={handleProjectClick}
                    onDetailClick={handleDetailClick}
                    onDelete={handleDeleteClick}
                  />
                )) || "No projects found."
              ) : (
                <div>No projects</div>
              )}
            </div>
            {!isDataFetching && (
              <FileTabs
                files={currentFolder?.files || []}
                fetchData={fetchData}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals (also keep the same, just use the Redux state) */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div
              role="dialog"
              id="radix-:r0:"
              aria-describedby="radix-:r2:"
              aria-labelledby="radix-:r1:"
              data-state="open"
              className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[600px]"
              tabIndex={-1}
              style={{ pointerEvents: "auto" }}
            >
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2
                  id="radix-:r1:"
                  className="text-lg font-semibold leading-none tracking-tight"
                >
                  {formData.id ? "Edit Project" : "Create New Project"}
                </h2>
              </div>
              <div className="overflow-y-auto max-h-[70vh] pr-1">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor=":rg:-form-item"
                    >
                      Project Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                        errors.name
                          ? "border-red-500 bg-red-50"
                          : "border-input bg-background"
                      }`}
                      placeholder="Enter project name"
                      name="name"
                      value={formData?.name || ""}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                      }}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="website"
                    >
                      Website
                    </label>
                    <div className="flex items-center relative">
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
                        className="lucide lucide-globe w-4 h-4 mr-2 text-gray-500"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                        <path d="M2 12h20"></path>
                      </svg>
                      <span className="absolute left-8 text-sm text-gray-700">
                        https://
                      </span>
                      <input
                        id="website"
                        name="website"
                        placeholder="example.com"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            website: e.target.value,
                          }))
                        }
                        className={`pl-[60px] flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                          errors.website
                            ? "border-red-500 bg-red-50"
                            : "border-input bg-background"
                        }`}
                      />
                    </div>
                    {errors.website && (
                      <p className="text-sm text-red-600">{errors.website}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor=":ri:-form-item"
                    >
                      LinkedIn
                    </label>
                    <div className="flex items-center">
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
                        className="lucide lucide-linkedin w-4 h-4 mr-2 text-gray-500"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect width="4" height="12" x="2" y="9"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                      <input
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                          errors.linkedin
                            ? "border-red-500 bg-red-50"
                            : "border-input bg-background"
                        }`}
                        placeholder="https://linkedin.com/company/..."
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={(handleInputChangee) => {
                          setFormData((prev) => ({
                            ...prev,
                            linkedin: handleInputChangee.target.value,
                          }));
                        }}
                      />
                    </div>
                    {errors.linkedin && (
                      <p className="text-sm text-red-600">{errors.linkedin}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor=":rj:-form-item"
                    >
                      Twitter
                    </label>
                    <div className="flex items-center">
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
                        className="lucide lucide-twitter w-4 h-4 mr-2 text-gray-500"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                      <input
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                          errors.twitter
                            ? "border-red-500 bg-red-50"
                            : "border-input bg-background"
                        }`}
                        placeholder="https://twitter.com/..."
                        name="twitter"
                        value={formData.twitter}
                        onChange={(handleInputChangee) => {
                          setFormData((prev) => ({
                            ...prev,
                            twitter: handleInputChangee.target.value,
                          }));
                        }}
                      />
                    </div>
                    {errors.twitter && (
                      <p className="text-sm text-red-600">{errors.twitter}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="store-link"
                    >
                      Store Link
                    </label>
                    <div className="flex items-center relative">
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
                        className="lucide lucide-store w-4 h-4 mr-2 text-gray-500"
                      >
                        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                        <path d="M2 7h20"></path>
                        <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2 2 0 0 1-2-2V7"></path>
                      </svg>
                      <span className="absolute left-8 text-sm text-gray-700">
                        https://
                      </span>
                      <input
                        id="store-link"
                        className={`pl-[60px] flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                          errors.website
                            ? "border-red-500 bg-red-50"
                            : "border-input bg-background"
                        }`}
                        placeholder="store.example.com"
                        name="store_link"
                        value={formData.store_link}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            store_link: e.target.value,
                          }));
                        }}
                      />
                    </div>
                    {errors.store_link && (
                      <p className="text-sm text-red-600">
                        {errors.store_link}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Extra Fields</label>

                    {/* Render added key-value pairs */}
                    {Object.entries(extraFields).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        {" "}
                        {/* Changed key={index} to key={key} for better React key management */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                              errors.extraFields &&
                              errors.extraFields.includes(key)
                                ? "border-red-500"
                                : "border-input"
                            }`}
                            value={key}
                            placeholder="Key"
                            onChange={(e) => {
                              editExtraField(key, e.target.value, value);
                            }}
                          />
                          <input
                            type="text"
                            className="flex-1 rounded-md border px-3 py-2 text-sm border-input"
                            value={value}
                            placeholder="Value"
                            onChange={(e) => {
                              editExtraField(key, key, e.target.value);
                            }}
                          />
                          <button
                            type="button"
                            className="px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                            onClick={() => {
                              const updatedFields = { ...extraFields };
                              delete updatedFields[key];
                              setExtraFields(updatedFields);

                              // Also remove from formData
                              setFormData((prev) => {
                                const updated = { ...prev };
                                delete updated[key];
                                return updated;
                              });
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add new extra field */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                          errors.extraFields ? "border-red-500" : "border-input"
                        }`}
                        placeholder="Key"
                        value={newExtra.key}
                        onChange={(e) =>
                          setNewExtra({ ...newExtra, key: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="flex-1 rounded-md border px-3 py-2 text-sm border-input"
                        placeholder="Value"
                        value={newExtra.value}
                        onChange={(e) =>
                          setNewExtra({ ...newExtra, value: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                        onClick={addExtraField}
                      >
                        Add
                      </button>
                    </div>
                    {errors.extraFields && (
                      <span className="text-sm text-red-600">
                        {errors.extraFields}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      type="button"
                      onClick={() => setIsNewProjectModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      type="submit"
                    >
                      {formData.id ? "Edit Project" : "Create Project"}
                      {/* {creatingProject ? "Creating..." : "Create Project"} */}
                    </button>
                  </div>
                </form>
              </div>
              <button
                type="button"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={() => setIsNewProjectModalOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-x h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
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

const Project: React.FC<ProjectProps> = ({
  onEdit,
  onClick,
  onDetailClick,
  onDelete,
  folder,
}) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3"
        onClick={() => {
          onClick(folder);
        }}
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(folder);
          }}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();

            onDelete(folder);
          }}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

interface FileTabsProps {
  files: FileItem[];
  fetchData: () => Promise<void>;
}

interface EditableTagProps {
  tag: string;
  onEdit: (newTag: string) => void;
  onRemove: () => void;
}

const EditableTag: React.FC<EditableTagProps> = ({ tag, onEdit, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tag);

  const handleSave = () => {
    if (editValue.trim() && editValue.trim() !== tag) {
      onEdit(editValue.trim());
    }
    setIsEditing(false);
    setEditValue(tag);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(tag);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSave()}
            className="flex-1 px-2 py-1 border rounded text-sm"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <span className="flex-1 text-sm">{tag}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

const FileTabs = ({ files, fetchData }: FileTabsProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingFileUrl, setDeletingFileUrl] = useState("");
  const [isManageTagsModalOpen, setIsManageTagsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileTags, setFileTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isUpdatingTags, setIsUpdatingTags] = useState(false);

  const openManageTagsModal = (file: FileItem) => {
    setSelectedFile(file);
    setFileTags([...file.tags]);
    setNewTag("");
    setIsManageTagsModalOpen(true);
  };

  const closeManageTagsModal = () => {
    setIsManageTagsModalOpen(false);
    setSelectedFile(null);
    setFileTags([]);
    setNewTag("");
  };

  const addTag = () => {
    if (newTag.trim() && !fileTags.includes(newTag.trim())) {
      setFileTags([...fileTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFileTags(fileTags.filter((tag) => tag !== tagToRemove));
  };

  const editTag = (oldTag: string, newTag: string) => {
    if (newTag.trim() && !fileTags.includes(newTag.trim())) {
      setFileTags(
        fileTags.map((tag) => (tag === oldTag ? newTag.trim() : tag))
      );
    }
  };

  const updateFileTags = async () => {
    if (!selectedFile) return;

    setIsUpdatingTags(true);
    try {
      const response = await axiosInstance.put(
        API_CONSTANTS.UPDATE_FILE_TAGS(selectedFile.id),
        { tags: fileTags }
      );

      if (response.status === 200) {
        toast.success("Tags updated successfully!");
        await fetchData(); // Refresh the file list
        closeManageTagsModal();
      }
    } catch (error: any) {
      console.error("Error updating tags:", error);
      toast.error(error.response?.data?.message || "Failed to update tags");
    } finally {
      setIsUpdatingTags(false);
    }
  };

  const deleteFile = async (file: FileItem) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    setIsDeleting(true);
    setDeletingFileUrl(file.storage_path);
    try {
      const res = await axiosInstance.delete(
        `${API_CONSTANTS.DELETE_FILE(file.id || "")}`
      );

      if (res.status == 200 || res.status == 204) {
        await fetchData();
        toast.success("File deleted successfully.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete file.");
    } finally {
      setIsDeleting(false);
    }
  };

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

  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);

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
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Tags
                  </th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length === 0 ? (
                  <tr className="border-b">
                    <td
                      colSpan={6}
                      className="p-4 text-center text-muted-foreground py-8"
                    >
                      <span className="block"> No files found</span>
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
                      <td className="h-12 px-4">
                        {file.tags.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {file.tags.join(", ")}
                            </span>
                            <button
                              onClick={() => openManageTagsModal(file)}
                              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                            >
                              Manage
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              No Tags
                            </span>
                            <button
                              onClick={() => openManageTagsModal(file)}
                              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                            >
                              Add Tags
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="h-12 px-4 text-right space-x-2 flex items-center">
                        <button
                          onClick={() => downloadDocument(file)}
                          className="inline-flex items-center rounded-md border bg-background hover:bg-accent h-8 px-3 text-sm"
                        >
                          View/Download
                        </button>
                        <button
                          onClick={() => deleteFile(file)}
                          className="inline-flex items-center rounded-md border border-destructive bg-destructive text-white hover:bg-destructive/90 h-8 px-3 text-sm"
                        >
                          {isDeleting && deletingFileUrl === file.storage_path
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manage Tags Modal */}
      {isManageTagsModalOpen && selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Manage Tags - {selectedFile.name}
              </h3>
              <button
                onClick={closeManageTagsModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Add new tag */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add new tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Add
                </button>
              </div>

              {/* Existing tags */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Current Tags:
                </h4>
                {fileTags.length > 0 ? (
                  <div className="space-y-2">
                    {fileTags.map((tag, index) => (
                      <EditableTag
                        key={index}
                        tag={tag}
                        onEdit={(newTag) => editTag(tag, newTag)}
                        onRemove={() => removeTag(tag)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No tags added yet.</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={closeManageTagsModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={updateFileTags}
                  disabled={isUpdatingTags}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                  {isUpdatingTags ? "Updating..." : "Update Tags"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  folder,
}) => {
  if (!isOpen || !folder) return null;
  useEffect(() => {}, []);
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{folder.name}</h2>
        {Object.keys(folder.meta_data).length > 0 ? (
          <div className="space-y-2 text-sm text-gray-800 p-4 bg-gray-100 border rounded">
            {Object.entries(folder.meta_data).map(([key, value], index) => (
              <p key={index}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        ) : (
          <span>No details about {folder.name} ...</span>
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

// Helper function
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

export default Vault;
