import { useEffect, useState } from "react";
import { FormBuilderData } from "@/types/event";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { selectUser } from "@/reudux/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import API_CONSTANTS from "@/utils/apiConstants";
import {
  selectFolder,
  updateLoading,
  updateAllFolders,
  updateError,
} from "@/reudux/slices/folderSlice";
import FilePicker from "@/components/FilePicker";

interface EventData {
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
  stages: {
    id: string;
    name: string;
    description: string;
    start_date: string;
    start_time: string;
  }[];
  coordinates: number[];
  evaluation_criteria: [];
  location_name: string;
}

const ApplyEvent = () => {
  const { eventId } = useParams();
  const user = useSelector(selectUser);
  const user_id = user?.id;
  const vault = useSelector(selectFolder);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [fields, setFields] = useState<FormBuilderData[]>([
    {
      id: "d8e64a75-464f-4228-82ef-7c06aa219bfc",
      type: "text",
      details: {
        label: "What is your name?",
      },
      required: true,
    },
    {
      id: "d8972cf4-bd5d-4dab-b981-baf4c45cdcb8",
      type: "textarea",
      details: {
        label: "Can you introduce yourself?",
      },
      required: true,
    },
    {
      id: "9a07fd03-765e-4d41-a4a8-9bbcc3c95b17",
      type: "radio",
      details: {
        label: "What is your monthly income?",
        options: [
          "below 1 lakh",
          "between 1 to 50 lakh",
          "between 50 to 100 lakh",
          "more than 100 lakh",
        ],
      },
      required: true,
    },
    {
      id: "cf805056-cf9a-4110-ba10-313eaeb79bbc",
      type: "checkbox",
      details: {
        label: "In which domain is your startup?",
        options: [
          "Technology",
          "Ecommerce",
          "Healthcare",
          "Education",
          "Hospitality",
        ],
      },
      required: true,
    },
    {
      id: "1dc42ffd-cd08-45b2-ae7f-1485744044c5",
      type: "date",
      details: {
        label: "When did you start your company?",
      },
      required: true,
    },
    {
      id: "1b7b946c-5268-44ed-9b54-70c06d015329",
      type: "time",
      details: {
        label: "When is the best time to connect with you?",
      },
      required: true,
    },
    {
      id: "d726df05-d40b-4ccb-a1e6-a8488e1b10b8",
      type: "file",
      details: {
        label: "Upload your pitch presentation here",
      },
      required: true,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [responseSubmitted, setResponseSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFormData, setPreviewFormData] = useState<{
    [key: string]: any;
  }>({});
  const [previewErrors, setPreviewErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [userResponses, setUserResponses] = useState<
    { answer: string; type: string }[]
  >([]);
  // State to store "Other" option text inputs for checkbox fields
  const [otherInputValues, setOtherInputValues] = useState<{
    [fieldId: string]: string;
  }>({});
  // Field-specific vault selections - key is fieldId, value contains folders and files
  const [fieldSelections, setFieldSelections] = useState<{
    [fieldId: string]: {
      selectedFolders: string[];
      selectedFiles: string[];
    };
  }>({});
  const [activeSuggestion, setActiveSuggestion] = useState<{
    [key: string]: boolean;
  }>({});

  // Handler for field-specific file/folder selections
  const handleFieldSelectionChange = (
    fieldId: string,
    folders: string[],
    files: string[]
  ) => {
    setFieldSelections((prev) => ({
      ...prev,
      [fieldId]: {
        selectedFolders: folders,
        selectedFiles: files,
      },
    }));
  };

  // Helper function to check if there are any files in selected folders
  const getAllFilesInFolders = (folderIds: string[]): string[] => {
    if (!vault?.folders || folderIds.length === 0) return [];

    const getAllFilesRecursive = (folder: any): string[] => {
      let fileIds: string[] = [];

      if (folder.files) {
        fileIds = [...fileIds, ...folder.files.map((file: any) => file.id)];
      }

      if (folder.children) {
        folder.children.forEach((child: any) => {
          fileIds = [...fileIds, ...getAllFilesRecursive(child)];
        });
      }

      return fileIds;
    };

    const findFolderById = (folder: any, targetId: string): any => {
      if (folder.id === targetId) return folder;

      if (folder.children) {
        for (const child of folder.children) {
          const found = findFolderById(child, targetId);
          if (found) return found;
        }
      }

      return null;
    };

    let allFilesInSelectedFolders: string[] = [];

    folderIds.forEach((folderId) => {
      const folder = findFolderById(vault.folders, folderId);
      if (folder) {
        const filesInFolder = getAllFilesRecursive(folder);
        allFilesInSelectedFolders = [
          ...allFilesInSelectedFolders,
          ...filesInFolder,
        ];
      }
    });

    return allFilesInSelectedFolders;
  };

  // Helper function to check if the selection contains at least one file
  const hasAtLeastOneFile = (
    selectedFolders: string[],
    selectedFiles: string[]
  ): boolean => {
    // If there are directly selected files, return true
    if (selectedFiles.length > 0) return true;

    // Check if any of the selected folders contain files
    const filesInFolders = getAllFilesInFolders(selectedFolders);
    return filesInFolders.length > 0;
  };
  const getSuggestions = (field: any) => {
    if (!userResponses || !Array.isArray(userResponses)) return [];
    return userResponses
      .filter(
        (resp) =>
          resp.type === field.type &&
          typeof resp.answer === "string" &&
          resp.answer.trim() !== ""
      )
      .map((resp) => resp.answer)
      .filter(
        (value, index, self) => self.indexOf(value) === index // unique
      );
  };
  interface PreviewFormData {
    [key: string]: any;
  }

  interface PreviewErrors {
    [key: string]: string;
  }

  const handlePreviewInputChange = (
    fieldId: string,
    value: any,
    required: boolean
  ) => {
    setPreviewFormData((prev: PreviewFormData) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (required && !value) {
      setPreviewErrors((prev: PreviewErrors) => ({
        ...prev,
        [fieldId]: "This field is required",
      }));
    } else {
      setPreviewErrors((prev: PreviewErrors) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handlePreviewSubmit = async () => {
    setIsSubmitting(true);
    // const
    const errors: { [key: string]: string } = {};
    fields.forEach((field) => {
      if (field.required) {
        if (field.type === "file") {
          // For file fields, check if files or folders are selected
          const selections = fieldSelections[field.id || ""];
          if (
            !selections ||
            (selections.selectedFiles.length === 0 &&
              selections.selectedFolders.length === 0)
          ) {
            errors[field.id || 0] =
              "At least one document or folder is required";
          } else {
            // Check if the selection contains at least one actual file
            const hasFiles = hasAtLeastOneFile(
              selections.selectedFolders,
              selections.selectedFiles
            );
            if (!hasFiles) {
              errors[field.id || 0] =
                "Selected folders must contain at least one file";
            }
          }
        } else if (!previewFormData[field.id || 0]) {
          errors[field.id || 0] = "This field is required";
        } else if (field.type === "checkbox" && field.details?.hasOtherOption) {
          // Special validation for checkbox fields with "Other" option
          const selectedValues = previewFormData[field.id || 0] || [];
          if (selectedValues.includes("other")) {
            const otherText = otherInputValues[field.id || "0"];
            if (!otherText || otherText.trim() === "") {
              errors[field.id || 0] = "Please specify the 'Other' option";
            }
          }
        }
      } else if (field.type === "file") {
        // For non-required file fields, if something is selected, validate it has files
        const selections = fieldSelections[field.id || ""];
        if (
          selections &&
          (selections.selectedFiles.length > 0 ||
            selections.selectedFolders.length > 0)
        ) {
          const hasFiles = hasAtLeastOneFile(
            selections.selectedFolders,
            selections.selectedFiles
          );
          if (!hasFiles) {
            errors[field.id || 0] =
              "Selected folders must contain at least one file";
          }
        }
      } else if (field.type === "checkbox" && field.details?.hasOtherOption) {
        // Validate "Other" text input for non-required checkbox fields too
        const selectedValues = previewFormData[field.id || 0] || [];
        if (selectedValues.includes("other")) {
          const otherText = otherInputValues[field.id || "0"];
          if (!otherText || otherText.trim() === "") {
            errors[field.id || 0] = "Please specify the 'Other' option";
          }
        }
      }
    });

    if (!acceptTerms) {
      errors.terms = "You must accept the terms and conditions";
    }

    // if (selectedFiles.length === 0) {
    //   errors.vault = "At least one document is required";
    // }
    console.log("Preview Errors:", errors);

    setPreviewErrors(errors);
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = fields.map((field) => {
      let answer = previewFormData[field.id || 0] || null;

      // Handle checkbox fields with "Other" option
      if (
        field.type === "checkbox" &&
        field.details?.hasOtherOption &&
        Array.isArray(answer)
      ) {
        // If "other" is selected, replace it with the actual text from otherInputValues
        answer = answer.map((value) => {
          if (value === "other") {
            const otherText = otherInputValues[field.id || "0"];
            return otherText ? `Other: ${otherText}` : "Other";
          }
          return value;
        });
      }

      return {
        question: field.details.label,
        answer: field.type === "file" ? "" : answer,
        fieldId: field.id,
        type: field.type,
        files:
          field.type === "file"
            ? fieldSelections[field.id || ""]?.selectedFiles || []
            : [],
        folders:
          field.type === "file"
            ? fieldSelections[field.id || ""]?.selectedFolders || []
            : [],
      };
    });

    const formDataWithCheckboxString = formDataToSend.map((item) => {
      if (item.type === "checkbox" && Array.isArray(item.answer)) {
        return {
          ...item,
          answer: item.answer.join(","),
        };
      }
      return item;
    });
    try {
      const applied_date = new Date().toISOString();
      await axiosInstance.post(API_CONSTANTS.REGISTERED_EVENT_RESPONSES, {
        user_id: user_id,
        event_id: eventId,
        formData: formDataWithCheckboxString,
        applied_date: applied_date,
        status: "",
        // selectedFolders: selectedFolders,
        // selectedFiles: selectedFiles,
      });
      setResponseSubmitted(true);
      toast.success("Application submitted successfully!");
      navigate("/applications");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setPreviewFormData({});
    setAcceptTerms(false);
    setPreviewErrors({});
    setFieldSelections({});
    setOtherInputValues({});
    navigate(`/event/view/${eventId}`);
  };

  const renderPreviewForm = () => {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Cards */}
          <div className="flex text-xl pb-6 font-semibold">
            {eventData?.title}
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Application Details
              </h2>
            </div>

            <div className="p-6 space-y-8">
              {/* Dynamic Form Fields */}
              {fields?.map((field) => (
                <div key={field.id} className="space-y-3">
                  <div>
                    <label className="text-base font-medium text-gray-900 block">
                      {field.details.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                  </div>

                  {field.type === "text" && (
                    <div className="relative">
                      <input
                        type="text"
                        className={`w-full rounded-md border ${
                          previewErrors[field.id || 0]
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Enter your answer"
                        value={previewFormData[field.id || 0] || ""}
                        onChange={(e) => {
                          handlePreviewInputChange(
                            field.id || "0",
                            e.target.value,
                            field.required || false
                          );
                          setActiveSuggestion((prev) => ({
                            ...prev,
                            [String(field.id)]: true,
                          }));
                        }}
                        onFocus={() =>
                          setActiveSuggestion((prev) => ({
                            ...prev,
                            [String(field.id)]: true,
                          }))
                        }
                        onBlur={() =>
                          setTimeout(
                            () =>
                              setActiveSuggestion((prev) => ({
                                ...prev,
                                [String(field.id)]: false,
                              })),
                            150
                          )
                        }
                      />
                      {/* Suggestions dropdown */}
                      {activeSuggestion[String(field.id)] &&
                        getSuggestions(field).length > 0 && (
                          <div className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 max-h-40 overflow-y-auto">
                            {getSuggestions(field).map((suggestion, idx) => (
                              <div
                                key={idx}
                                className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-50"
                                onMouseDown={() => {
                                  handlePreviewInputChange(
                                    field.id || "0",
                                    suggestion,
                                    field.required || false
                                  );
                                  setActiveSuggestion((prev) => ({
                                    ...prev,
                                    [String(field.id)]: false,
                                  }));
                                }}
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  )}

                  {field.type === "textarea" && (
                    <div className="relative">
                      <textarea
                        className={`w-full rounded-md border ${
                          previewErrors[field.id || 0]
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-y`}
                        placeholder="Enter your answer"
                        value={previewFormData[field.id || 0] || ""}
                        onChange={(e) => {
                          handlePreviewInputChange(
                            field.id || "0",
                            e.target.value,
                            field.required || false
                          );
                          setActiveSuggestion((prev) => ({
                            ...prev,
                            [String(field.id)]: true,
                          }));
                        }}
                        onFocus={() =>
                          setActiveSuggestion((prev) => ({
                            ...prev,
                            [String(field.id)]: true,
                          }))
                        }
                        onBlur={() =>
                          setTimeout(
                            () =>
                              setActiveSuggestion((prev) => ({
                                ...prev,
                                [String(field.id)]: false,
                              })),
                            150
                          )
                        }
                      />
                      {/* Suggestions dropdown */}
                      {activeSuggestion[String(field.id)] &&
                        getSuggestions(field).length > 0 && (
                          <div className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 max-h-40 overflow-y-auto">
                            {getSuggestions(field).map((suggestion, idx) => (
                              <div
                                key={idx}
                                className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-50"
                                onMouseDown={() => {
                                  handlePreviewInputChange(
                                    field.id || "0",
                                    suggestion,
                                    field.required || false
                                  );
                                  setActiveSuggestion((prev) => ({
                                    ...prev,
                                    [String(field.id)]: false,
                                  }));
                                }}
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  )}

                  {field.type === "radio" && (
                    <div className="space-y-3">
                      {field.details.options?.map(
                        (option: string, index: number) => (
                          <label
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="radio"
                              name={field.id || "radio-group"}
                              value={option}
                              checked={
                                previewFormData[field.id || 0] === option
                              }
                              onChange={(e) =>
                                handlePreviewInputChange(
                                  field.id || "0",
                                  e.target.value,
                                  field.required || false
                                )
                              }
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  )}

                  {field.type === "checkbox" && (
                    <div className="space-y-3">
                      {field.details.options?.map(
                        (option: string, index: number) => (
                          <label
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="checkbox"
                              value={option}
                              checked={previewFormData[field.id || 0]?.includes(
                                option
                              )}
                              onChange={(e) => {
                                const currentValues =
                                  previewFormData[field.id || 0] || [];
                                const newValues: string[] = e.target.checked
                                  ? [...currentValues, option]
                                  : currentValues.filter(
                                      (v: string) => v !== option
                                    );
                                handlePreviewInputChange(
                                  field.id || "0",
                                  newValues,
                                  field.required || false
                                );
                              }}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                            />
                            <span className="text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        )
                      )}
                      {field.details?.hasOtherOption && (
                        <div className="space-y-2">
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              value="other"
                              checked={previewFormData[field.id || 0]?.includes(
                                "other"
                              )}
                              onChange={(e) => {
                                const currentValues =
                                  previewFormData[field.id || 0] || [];
                                const fieldId = field.id || "0";

                                if (e.target.checked) {
                                  // Add "other" to selected values
                                  const newValues = [...currentValues, "other"];
                                  handlePreviewInputChange(
                                    fieldId,
                                    newValues,
                                    field.required || false
                                  );
                                } else {
                                  // Remove "other" from selected values and clear the text input
                                  const newValues = currentValues.filter(
                                    (v: string) => v !== "other"
                                  );
                                  handlePreviewInputChange(
                                    fieldId,
                                    newValues,
                                    field.required || false
                                  );
                                  // Clear the "Other" text input
                                  setOtherInputValues((prev) => ({
                                    ...prev,
                                    [fieldId]: "",
                                  }));
                                }
                              }}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                            />
                            <span className="text-sm text-gray-700">Other</span>
                          </label>
                          {previewFormData[field.id || 0]?.includes(
                            "other"
                          ) && (
                            <div className="ml-7">
                              <input
                                type="text"
                                placeholder="Please specify..."
                                value={otherInputValues[field.id || "0"] || ""}
                                onChange={(e) => {
                                  setOtherInputValues((prev) => ({
                                    ...prev,
                                    [field.id || "0"]: e.target.value,
                                  }));
                                }}
                                className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {field.type === "date" && (
                    <input
                      type="date"
                      className={`w-full rounded-md border ${
                        previewErrors[field.id || 0]
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={previewFormData[field.id || 0] || ""}
                      onChange={(e) =>
                        handlePreviewInputChange(
                          field.id || "0",
                          e.target.value,
                          field.required || false
                        )
                      }
                    />
                  )}

                  {field.type === "time" && (
                    <input
                      type="time"
                      className={`w-full rounded-md border ${
                        previewErrors[field.id || 0]
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={previewFormData[field.id || 0] || ""}
                      onChange={(e) =>
                        handlePreviewInputChange(
                          field.id || "0",
                          e.target.value,
                          field.required || false
                        )
                      }
                    />
                  )}

                  {/* {field.type === "file" && (
                    <input
                      type="file"
                      className={`w-full rounded-md border ${
                        previewErrors[field.id || 0]
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                      onChange={(e) =>
                        handlePreviewInputChange(
                          field.id || "0",
                          e.target.files?.[0],
                          field.required || false
                        )
                      }
                    />
                  )} */}

                  {field.type === "file" && (
                    <div>
                      <FilePicker
                        fieldId={field.id || ""}
                        vault={vault}
                        selectedFolders={
                          fieldSelections[field.id || ""]?.selectedFolders || []
                        }
                        selectedFiles={
                          fieldSelections[field.id || ""]?.selectedFiles || []
                        }
                        onSelectionChange={handleFieldSelectionChange}
                        error={previewErrors[field.id || 0]}
                        onDataRefresh={fetchDataVault}
                      />
                      {/* Show additional validation info */}
                      {fieldSelections[field.id || ""] &&
                        (fieldSelections[field.id || ""].selectedFolders
                          .length > 0 ||
                          fieldSelections[field.id || ""].selectedFiles.length >
                            0) && (
                          <div className="mt-2 text-sm">
                            {(() => {
                              const selections =
                                fieldSelections[field.id || ""];
                              const filesInFolders = getAllFilesInFolders(
                                selections.selectedFolders
                              );
                              const totalFiles =
                                selections.selectedFiles.length +
                                filesInFolders.length;

                              if (
                                totalFiles === 0 &&
                                selections.selectedFolders.length > 0
                              ) {
                                return (
                                  <p className="text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                                    ⚠️ Selected folders contain no files. Please
                                    select folders with documents or upload
                                    files.
                                  </p>
                                );
                              }

                              return (
                                <p className="text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
                                  ✓ {totalFiles} file
                                  {totalFiles !== 1 ? "s" : ""} will be included
                                  with your application
                                </p>
                              );
                            })()}
                          </div>
                        )}
                    </div>
                  )}

                  {previewErrors[field.id || 0] && (
                    <p className="text-sm text-red-500">
                      {previewErrors[field.id || 0]}
                    </p>
                  )}
                </div>
              ))}

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <div
                    className="text-sm cursor-pointer select-none"
                    onClick={() => setAcceptTerms((prev) => !prev)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setAcceptTerms((prev) => !prev);
                    }}
                    aria-pressed={acceptTerms}
                  >
                    <span className="font-medium text-gray-900">
                      I accept the terms and conditions
                    </span>
                    <p className="text-gray-500 mt-1">
                      I agree to share my application materials with the event
                      organizers and judges.
                    </p>
                  </div>
                </div>

                {previewErrors.terms && (
                  <p className="text-sm text-red-500 ml-7">
                    {previewErrors.terms}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePreviewSubmit}
                  disabled={isSubmitting || responseSubmitted}
                  className={`px-6 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    responseSubmitted
                      ? "bg-green-600 hover:bg-green-700"
                      : isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {responseSubmitted
                    ? "Application Submitted"
                    : isSubmitting
                    ? "Submitting..."
                    : "Submit Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/form/${eventId}`);
      const data = response.data;
      setFields(data.forms || []);
      setEventData(data.event || {});
    } catch (error: any) {
      console.error("Error fetching event data:", error);
      toast.error(error.message || "Error fetching event data");
    } finally {
      setLoading(false);
    }
  };

  const getResponseSuggestion = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/responses/user-responses`, {
        user_id: user_id,
      });
      const data = response?.data;
      setUserResponses(data.data);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!eventId || !user_id) return;
    fetchData();
    getResponseSuggestion();
  }, [eventId]);

  const fetchDataVault = async () => {
    dispatch(updateLoading(true));

    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_FOLDER_TREE(user_id || "")
      );
      const data = response.data;
      dispatch(updateAllFolders(data));
    } catch (error: any) {
      dispatch(updateError(error.message || "Failed to fetch projects"));
      console.error("Error fetching projects:", error);
    } finally {
      dispatch(updateLoading(false));
    }
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/auth");
      return;
    }

    if (vault?.folders) {
      // folders are already loaded in redux store
    } else {
      fetchDataVault();
    }
  }, []);

  return (
    <div>
      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      ) : (
        renderPreviewForm()
      )}
    </div>
  );
};

export default ApplyEvent;
