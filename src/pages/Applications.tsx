import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchEventApplications,
  selectEventApplications,
  selectEventApplicationLoading,
  selectEventApplicationError,
  selectEventApplicationSuccess,
  clearMessages,
  IEventApplication,
} from "./../reudux/slices/eventApplicationSlice";
import { AppDispatch } from "../reudux/store";
import { selectUser } from "@/reudux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Popup from "@/components/Popup";
import SharedFolderTree from "@/components/SharedFolderTree";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

type Field = {
  question: string;
  answer: string;
};

type Application = {
  id?: string;
  event_name?: string;
  applied_date?: string;
  status?: string;
  documents?: string[];
  project_description?: string;
  fields?: Field[];
  judge_comment?: string | null;
  final_score?: number | null;
};

type ApplicationModalProps = {
  application: IEventApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (application: IEventApplication) => void;
};

const ApplicationModal = ({
  application,
  onClose,
  onViewDetails,
}: ApplicationModalProps) => {
  const [folderModal, setFolderModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  if (application === null) {
    return null; // Handle case where application is null
  }
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Application Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
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
          <div className="space-y-2">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">
                  Event Information
                </h3>
                <div>
                  <p className="text-sm font-medium">
                    {application.eventsDetails[0]?.title || "Unknown Event"}
                  </p>
                  <p className="text-sm text-gray-600">TechStars</p>
                </div>
              </div>

              <div className="ml-6">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {application.status.toLowerCase() === "not-submitted"
                    ? "Submitted"
                    : application.status
                    ? application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)
                    : "Unknown"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Applied on:{" "}
                {application.applied_date
                  ? formatDate(application.applied_date)
                  : "2023-09-20"}
              </p>
            </div>

            {application.response && application.response.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Application Responses
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-3 border rounded-lg p-3 bg-gray-50">
                  {application.response.map((field, index) => (
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
            )}

            {(application.judge_comment || application.final_score) && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Evaluation</h4>
                {application.final_score && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Final Score:{" "}
                    </span>
                    <span className="text-sm text-gray-600">
                      {application.final_score}
                    </span>
                  </div>
                )}
                {application.judge_comment && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Judge Comments:{" "}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {application.judge_comment}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Close
          </button>
          <button
            onClick={() => onViewDetails(application)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md"
          >
            View Full Details
          </button>
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
  );
};

const Applications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const eventApplications = useSelector(selectEventApplications);
  const loading = useSelector(selectEventApplicationLoading);
  const error = useSelector(selectEventApplicationError);
  const success = useSelector(selectEventApplicationSuccess);

  const [selectedApplication, setSelectedApplication] =
    useState<IEventApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && typeof user.id === "string") {
      dispatch(fetchEventApplications(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [success, error, dispatch]);

  // const getStatusColor = (status: string) => {
  //   switch (status?.toLowerCase()) {
  //     case "accepted":
  //       return "bg-green-100 text-green-800 border-green-200";
  //     case "rejected":
  //       return "bg-red-100 text-red-800 border-red-200";
  //     case "reviewing":
  //       return "bg-yellow-100 text-yellow-800 border-yellow-200";
  //     case "submitted":
  //       return "bg-blue-100 text-blue-800 border-blue-200";
  //     case "not-submitted":
  //       return "bg-gray-100 text-gray-800 border-gray-200";
  //     default:
  //       return "bg-gray-100 text-gray-800 border-gray-200";
  //   }
  // };

  // const handleViewClick = (application: IEventApplication) => {
  //   setSelectedApplication(application);
  //   setIsModalOpen(true);
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  interface HandleViewDetails {
    (application: Application): void;
  }

  const navigate = useNavigate();
  const handleViewDetails: HandleViewDetails = (application) => {
    // Pass the application data through navigation state
    navigate(`/applications/${application.id}`, {
      state: {
        applicationData: application,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-6 md:py-8 max-w-6xl mx-auto">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                My Applications
              </h1>
              <p className="text-muted-foreground">
                Track the status of your event applications.
              </p>
            </div>
            <a
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4 md:mt-0"
              href="/events"
            >
              Find New Events
            </a>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h2 className="text-lg font-semibold">
                Applications ({eventApplications.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Loading applications...
                </div>
              </div>
            ) : eventApplications.length === 0 ? (
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications found
                </h3>
                <p className="text-gray-500 mb-4">
                  You haven't submitted any event applications yet.
                </p>
                <a
                  href="/events"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Browse Events
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Event Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Date Applied
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Documents
                      </th>
                      {/* <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Status
                      </th> */}
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventApplications
                      ?.slice()
                      ?.sort((a, b) => {
                        // Sort by applied_date, latest first
                        if (!a.applied_date && !b.applied_date) return 0;
                        if (!a.applied_date) return 1;
                        if (!b.applied_date) return -1;
                        return (
                          new Date(b.applied_date).getTime() -
                          new Date(a.applied_date).getTime()
                        );
                      })
                      ?.map((application, index) => (
                        <tr
                          key={application.id || index}
                          className="border-b transition-colors hover:bg-gray-50"
                        >
                          <td className="p-4 align-middle">
                            <div className="font-medium text-sm">
                              {application.eventsDetails[0].title ||
                                "Unknown Event"}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="text-sm">
                              {application.applied_date
                                ? formatDate(application.applied_date)
                                : "N/A"}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-wrap gap-1">
                              {application.response &&
                              application.response.length > 0 ? (
                                (() => {
                                  let totalFiles = 0;
                                  let totalFolders = 0;

                                  application.response.forEach((resp) => {
                                    if (resp.files) {
                                      totalFiles += resp.files.length;
                                    }
                                    if (resp.folders) {
                                      totalFolders += resp.folders.length;
                                    }
                                  });

                                  return (
                                    <div className="flex flex-col gap-1">
                                      <div className="text-sm text-gray-700">
                                        {totalFolders > 0 && (
                                          <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium bg-green-50 text-green-700 mr-1">
                                            {totalFolders}{" "}
                                            {totalFolders === 1
                                              ? "folder"
                                              : "folders"}
                                          </span>
                                        )}
                                        {totalFiles > 0 && (
                                          <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                                            {totalFiles}{" "}
                                            {totalFiles === 1
                                              ? "file"
                                              : "files"}
                                          </span>
                                        )}
                                      </div>
                                      {totalFiles === 0 &&
                                        totalFolders === 0 && (
                                          <span className="text-gray-500 text-sm">
                                            No documents
                                          </span>
                                        )}
                                    </div>
                                  );
                                })()
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  No documents
                                </span>
                              )}
                            </div>
                          </td>
                          {/* <td className="p-4 align-middle">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </span>
                        </td> */}
                          {/* <td className="p-4 align-middle max-w-xs">
                          <div className="text-sm text-gray-600 truncate">
                            {application.project_description ||
                              "No description"}
                          </div>
                        </td> */}
                          <td className="p-4 align-middle text-right">
                            <div className="flex justify-center gap-2">
                              <button
                                className="inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3"
                                onClick={() => handleViewDetails(application)}
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

      {isModalOpen && (
        <ApplicationModal
          application={selectedApplication}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};

export default Applications;
