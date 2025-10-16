import Popup from "@/components/Popup";
import SharedFolderTree from "@/components/SharedFolderTree";
import { EventInterface } from "@/types/event";
import axiosInstance from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface Responses {
  id: string;
  user_id: string;
  event_id: string;
  submitted_at: string;
  question: string;
  answer: string;
  application_id: string;
  type: string;
  files: string[];
  folders: string[];
  foldersData: {
    id: string;
    name: string;
  }[];
  filesData: {
    id: string;
    name: string;
    storage_path: string;
  }[];
}

type Participant = {
  id: string;
  name: string;
  status: string;
  judgeAssigned: string;
  score: string;
  submittedDate: string;
  email: string;
  response: Responses[];
};

type ParticipantModalProps = {
  participant: Participant | null;
  responses: Responses[];
  isOpen: boolean;
  onClose: () => void;
};

type StatusDropdownProps = {
  participant: Participant;
  availableStatuses: string[];
  onStatusChange: (participantId: string, newStatus: string) => void;
  onAddCustomStatus: (newStatus: string) => void;
};

const StatusDropdown = ({
  participant,
  availableStatuses,
  onStatusChange,
  onAddCustomStatus,
}: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customStatus, setCustomStatus] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<
    "bottom-right" | "bottom-left" | "top-right" | "top-left"
  >("bottom-right");
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "reviewing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "pending review":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "waitlisted":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 192; // w-48 = 12rem = 192px
    const dropdownHeight = 240; // max-h-60 = 15rem = 240px
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Check horizontal positioning
    const spaceOnRight = viewportWidth - buttonRect.right;
    const spaceOnLeft = buttonRect.left;
    const useLeftAlignment =
      spaceOnRight < dropdownWidth && spaceOnLeft > dropdownWidth;

    // Check vertical positioning
    const spaceBelow = viewportHeight - (buttonRect.bottom - scrollY);
    const spaceAbove = buttonRect.top - scrollY;
    const useTopAlignment =
      spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

    if (useTopAlignment && useLeftAlignment) {
      setDropdownPosition("top-left");
    } else if (useTopAlignment && !useLeftAlignment) {
      setDropdownPosition("top-right");
    } else if (!useTopAlignment && useLeftAlignment) {
      setDropdownPosition("bottom-left");
    } else {
      setDropdownPosition("bottom-right");
    }
  };

  const handleToggleDropdown = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const getDropdownClasses = () => {
    const baseClasses =
      "absolute z-50 w-48 bg-white border border-gray-200 rounded-md shadow-lg";

    switch (dropdownPosition) {
      case "bottom-right":
        return `${baseClasses} mt-1 right-0 top-full`;
      case "bottom-left":
        return `${baseClasses} mt-1 left-0 top-full`;
      case "top-right":
        return `${baseClasses} mb-1 right-0 bottom-full`;
      case "top-left":
        return `${baseClasses} mb-1 left-0 bottom-full`;
      default:
        return `${baseClasses} mt-1 right-0 top-full`;
    }
  };

  const handleStatusSelect = (status: string) => {
    onStatusChange(participant.id, status);
    setIsOpen(false);
  };

  const handleCustomStatusSubmit = () => {
    if (customStatus.trim()) {
      onAddCustomStatus(customStatus.trim());
      onStatusChange(participant.id, customStatus.trim());
      setCustomStatus("");
      setShowCustomInput(false);
      setIsOpen(false);
    }
  };

  const handleAddCustomClick = () => {
    setShowCustomInput(true);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
    setShowCustomInput(false);
    setCustomStatus("");
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold hover:opacity-80 transition-opacity ${getStatusColor(
          participant.status
        )}`}
      >
        {participant.status}
        <svg
          className="ml-1 w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClickOutside} />
          <div className={getDropdownClasses()}>
            <div className="py-1 max-h-60 overflow-y-auto">
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center ${
                    participant.status === status ? "bg-gray-100" : ""
                  }`}
                >
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium mr-2 ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </button>
              ))}

              <hr className="my-1" />

              {!showCustomInput ? (
                <button
                  onClick={handleAddCustomClick}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-blue-600 flex items-center"
                >
                  <svg
                    className="w-3 h-3 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add custom status
                </button>
              ) : (
                <div className="px-3 py-2">
                  <input
                    type="text"
                    value={customStatus}
                    onChange={(e) => setCustomStatus(e.target.value)}
                    placeholder="Enter custom status"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleCustomStatusSubmit();
                      }
                    }}
                  />
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={handleCustomStatusSubmit}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomStatus("");
                      }}
                      className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ParticipantModal = ({
  participant,
  responses,
  isOpen,
  onClose,
}: ParticipantModalProps) => {
  if (!isOpen || !participant) return null;

  const [folderModal, setFolderModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  console.log(responses);
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "reviewing":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Participant Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
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

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {/* Participant Info */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {participant.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    participant.status
                  )}`}
                >
                  {participant.status}
                </span>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Email: </span>
                    <span className="text-gray-900">{participant.email}</span>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Application Details
                </h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Submitted: </span>
                    <span className="text-gray-900">
                      {participant.submittedDate
                        ? new Date(participant.submittedDate).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )
                        : "—"}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Score: </span>
                    <span className="text-gray-900">{participant.score}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Judge: </span>
                    <span className="text-gray-900">
                      {participant.judgeAssigned}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-6 border-t">
            <div className="font-medium text-gray-900">Responses</div>
            {responses.map((field, index) => (
              <div key={index} className="bg-white rounded-md p-3 border">
                <h5 className="font-medium text-sm text-gray-800 mb-1">
                  {field.question}
                </h5>

                {field.type === "file" ? (
                  <div className="space-y-2">
                    {field.folders &&
                      field.folders.length > 0 &&
                      field?.foldersData?.map((file, fileIndex) => (
                        <div
                          key={fileIndex}
                          className="flex items-center text-sm cursor-pointer hover:underline"
                          onClick={() => [
                            setCurrentFolder(file.id),
                            setFolderModal(true),
                          ]}
                        >
                          <svg
                            className="w-4 h-4 mr-2 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          {file.name}
                        </div>
                      ))}
                    {field.files &&
                      field.files.length > 0 &&
                      field?.filesData?.map((file, fileIndex) => (
                        <div
                          key={fileIndex}
                          className="flex items-center text-sm cursor-pointer hover:underline"
                          onClick={() => {
                            window.open(file.storage_path, "_blank");
                          }}
                        >
                          <svg
                            className="w-4 h-4 mr-2 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          {file.name}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 break-words">
                    {field.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {folderModal && currentFolder && (
          <Popup onClose={() => setFolderModal(false)}>
            <SharedFolderTree
              folderId={currentFolder}
              // className="min-h-[400px]"
              showFileActions={true}
              allowDownload={true}
            />
          </Popup>
        )}
      </div>
    </div>
  );
};

const Participants: React.FC<{ eventData: EventInterface }> = ({
  eventData,
}) => {
  const { id: eventIdFromParam } = useParams();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>(
    eventData.statuses || []
  );
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [bulkStatus, setBulkStatus] = useState("");

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/event-applications/all/event/" + eventIdFromParam
      );
      const data = response.data;
      const formattedData = data.applications.map((app: any) => ({
        id: app.id,
        name: app.user.name,
        status: app.status,
        judgeAssigned: app.judge_id ? app.judgesDetails.name : "Not assigned",
        score: app.final_score || "—",
        submittedDate: app.applied_date || "—",
        email: app.user.email || "—",
        response: app.response || [],
      }));
      setParticipants(formattedData);
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch = participant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Statuses" ||
      participant.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleViewClick = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParticipant(null);
  };

  const handleExport = () => {
    try {
      // Use selected participants if any, otherwise use all filtered participants
      const participantsToExport =
        selectedParticipants.length > 0
          ? participants.filter((p) => selectedParticipants.includes(p.id))
          : filteredParticipants;

      if (participantsToExport.length === 0) {
        toast.error("No participants to export");
        return;
      }
      console.log(participantsToExport);
      // Get all unique questions from all participants
      const allQuestions = new Set<string>();
      participantsToExport.forEach((participant) => {
        participant.response?.forEach((response) => {
          if (response.question) {
            allQuestions.add(response.question);
          }
        });
      });

      const uniqueQuestions = Array.from(allQuestions);

      // Prepare data for export
      const exportData = participantsToExport.map((participant, index) => {
        const baseData = {
          "Sr. No": index + 1,
          "Participant Name": participant.name,
          "Email Address": participant.email,
          Status: participant.status,
          "Judge Assigned": participant.judgeAssigned,
          Score: participant.score === "—" ? "" : participant.score,
          "Submitted Date": participant.submittedDate
            ? new Date(participant.submittedDate).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "Not submitted",
          "Response Count": participant.response?.length || 0,
        };

        // Add responses for each unique question
        const responseData: { [key: string]: string } = {};
        uniqueQuestions.forEach((question) => {
          const response = participant.response?.find(
            (r) => r.question === question
          );
          let answerText = "";

          if (response) {
            if (response.type === "file") {
              // For file responses, combine file and folder names
              const fileNames =
                response.filesData?.map((file) => file.name) || [];
              const folderNames =
                response.foldersData?.map((folder) => folder.name) || [];
              const allNames = [...fileNames, ...folderNames];
              answerText =
                allNames.length > 0 ? allNames.join("; ") : "Files uploaded";
            } else {
              answerText = response.answer || "";
            }
          }

          // Clean the question text for use as column header
          const cleanQuestion = question.replace(/[,\n\r]/g, " ").trim();
          responseData[`${cleanQuestion}`] = answerText;
        });

        return { ...baseData, ...responseData };
      });

      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) =>
          headers
            .map((header) => {
              const value = row[header as keyof typeof row];
              const stringValue = String(value || "");
              // Escape quotes and wrap in quotes if contains comma, quote, or newline
              if (
                stringValue.includes(",") ||
                stringValue.includes('"') ||
                stringValue.includes("\n") ||
                stringValue.includes("\r")
              ) {
                return `"${stringValue.replace(/"/g, '""')}"`;
              }
              return stringValue;
            })
            .join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);

      // Generate filename with event title and current date
      const eventTitle =
        eventData.title?.replace(/[^a-zA-Z0-9]/g, "-") || "event";
      const dateStr = new Date().toISOString().split("T")[0];
      const selectedText = selectedParticipants.length > 0 ? "-selected" : "";
      link.setAttribute(
        "download",
        `participants-${eventTitle}${selectedText}-${dateStr}.csv`
      );

      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const exportMessage =
        selectedParticipants.length > 0
          ? `Exported ${selectedParticipants.length} selected participants to CSV`
          : `Exported ${participantsToExport.length} participants to CSV`;

      toast.success(exportMessage);

      // Clear selection after export if there was a selection
      if (selectedParticipants.length > 0) {
        setSelectedParticipants([]);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export participants data");
    }
  };

  const handleBulkEmail = () => {
    toast.success("Bulk email functionality will be implemented soon");
  };

  const handleStatusChange = async (
    participantId: string,
    newStatus: string
  ) => {
    try {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId ? { ...p, status: newStatus } : p
        )
      );

      await axiosInstance.put("/event-applications/update-user-status", {
        updates: [
          {
            id: participantId,
            status: newStatus,
          },
        ],
      });

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
      fetchParticipants();
    }
  };

  const handleAddCustomStatus = async (newStatus: string) => {
    if (!availableStatuses.includes(newStatus)) {
      try {
        await axiosInstance.put(`events/add-status/${eventIdFromParam}`, {
          status: newStatus,
        });

        setAvailableStatuses((prev) => [...prev, newStatus]);
        toast.success(`Custom status "${newStatus}" added`);
      } catch (error) {
        console.error("Error adding custom status:", error);
        toast.error("Failed to add custom status");
      }
    }
  };

  // Bulk update functions
  const handleSelectParticipant = (participantId: string, checked: boolean) => {
    if (checked) {
      setSelectedParticipants((prev) => [...prev, participantId]);
    } else {
      setSelectedParticipants((prev) =>
        prev.filter((id) => id !== participantId)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedParticipants(filteredParticipants.map((p) => p.id));
    } else {
      setSelectedParticipants([]);
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (selectedParticipants.length === 0 || !bulkStatus) {
      toast.error("Please select participants and choose a status");
      return;
    }

    try {
      // Update participants locally first
      setParticipants((prev) =>
        prev.map((p) =>
          selectedParticipants.includes(p.id) ? { ...p, status: bulkStatus } : p
        )
      );

      // API call for bulk update using the new endpoint
      const updates = selectedParticipants.map((participantId) => ({
        id: participantId,
        status: bulkStatus,
      }));

      await axiosInstance.put("/event-applications/update-user-status", {
        updates: updates,
      });

      toast.success(
        `Status updated for ${selectedParticipants.length} participants`
      );
      setSelectedParticipants([]);
      setBulkStatus("");
    } catch (error) {
      console.error("Error updating bulk status:", error);
      toast.error("Failed to update status for some participants");
      fetchParticipants(); // Refresh to get correct state
    }
  };

  const handleCancelBulkUpdate = () => {
    setSelectedParticipants([]);
    setBulkStatus("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-6 md:py-8 max-w-6xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Participants
              </h1>
              <p className="text-muted-foreground">
                Manage and track all event participants and their applications.
              </p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search participants..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter */}

                {/* Category Filter */}
                {/* <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select> */}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="All Statuses">All Statuses</option>
                  {eventData.statuses?.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleExport}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {selectedParticipants.length > 0
                    ? `Export Selected (${selectedParticipants.length})`
                    : "Export All"}
                </button>
                <button
                  onClick={handleBulkEmail}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Bulk Email
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedParticipants.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedParticipants.length} participant
                    {selectedParticipants.length > 1 ? "s" : ""} selected
                  </span>
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select new status</option>
                    {availableStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkStatusUpdate}
                    disabled={!bulkStatus}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={handleCancelBulkUpdate}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Participants Table */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="bg-gray-50 p-4 border-b">
              <h2 className="text-lg font-semibold">
                Participants ({filteredParticipants.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Loading participants...
                </div>
              </div>
            ) : filteredParticipants.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No participants found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="relative">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedParticipants.length ===
                              filteredParticipants.length &&
                            filteredParticipants.length > 0
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Participant
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Judge Assigned
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Score
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Submitted
                      </th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.map((participant) => (
                      <tr
                        key={participant.id}
                        className="border-b transition-colors hover:bg-gray-50"
                      >
                        <td className="p-4 align-middle">
                          <input
                            type="checkbox"
                            checked={selectedParticipants.includes(
                              participant.id
                            )}
                            onChange={(e) =>
                              handleSelectParticipant(
                                participant.id,
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </td>
                        <td className="p-4 align-middle">
                          <div>
                            <div className="font-medium text-sm">
                              {participant.name}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <StatusDropdown
                            participant={participant}
                            availableStatuses={availableStatuses}
                            onStatusChange={handleStatusChange}
                            onAddCustomStatus={handleAddCustomStatus}
                          />
                        </td>
                        <td className="p-4 align-middle">
                          <div className="text-sm">
                            {participant.judgeAssigned}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="text-sm font-medium">
                            {participant.score}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="text-sm">
                            {participant.submittedDate
                              ? new Date(
                                  participant.submittedDate
                                ).toLocaleString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex justify-center gap-2">
                            <button
                              className="inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3"
                              onClick={() => handleViewClick(participant)}
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <ParticipantModal
        participant={selectedParticipant}
        responses={selectedParticipant?.response || []}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Participants;
