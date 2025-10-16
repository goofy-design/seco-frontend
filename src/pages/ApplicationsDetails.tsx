import Popup from "@/components/Popup";
import RichTextDisplay from "@/components/RichTextDisplay";
import SharedFolderTree from "@/components/SharedFolderTree";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ApplicationDetailsProps {
  applicationData: {
    id: string;
    applied_date: string;
    status: string;
    judge_comment: string | null;
    judge_id: string;
    event_id: string;
    user_id: string;
    final_score: number | null;
    review_date: string;
    evaluation_scores: Record<string, any>;
    user: {
      id: string;
      created_at: string;
      name: string;
      email: string;
      role: string;
      status: string;
    };
    judgesDetails: {
      id: string;
      created_at: string;
      name: string;
      event_id: string;
      email: string;
      expertise: string[];
    };
    eventsDetails: Array<{
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
      stages: Array<{
        id: string;
        name: string;
        description: string;
        start_date: string;
        start_time: string;
      }>;
      coordinates: number[];
      evaluation_criteria: any[];
    }>;
    response: Array<{
      id: string;
      user_id: string;
      event_id: string;
      submitted_at: string;
      question: string;
      answer: string | null;
      application_id: string;
      type: string;
      files?: string[];
      folders?: string[];
      filesData?: Array<{
        id: string;
        name: string;
        storage_path: string;
      }>;
      foldersData?: Array<{
        id: string;
        name: string;
      }>;
    }>;
  };
}

const ApplicationDetails = ({ applicationData }: ApplicationDetailsProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderModal, setFolderModal] = useState(false);
  const eventInfo = applicationData.eventsDetails[0];
  const user = applicationData.user;
  const judge = applicationData.judgesDetails;

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get submitted documents from responses
  const submittedDocuments = applicationData.response
    .filter((response) => response.type === "file" && response.filesData)
    .flatMap((response) => response.filesData || [])
    .map((file) => ({
      name: file.name,
      downloadUrl: file.storage_path,
      dateAdded: formatDate(applicationData.applied_date),
      type: "file" as const,
    }));

  // Get submitted folders from responses
  const submittedFolders = applicationData.response
    .filter((response) => response.type === "file" && response.foldersData)
    .flatMap((response) => response.foldersData || [])
    .map((folder) => ({
      id: folder.id,
      name: folder.name,
      dateAdded: formatDate(applicationData.applied_date),
      type: "folder" as const,
    }));

  // Combine folders and files
  const allSubmittedItems = [...submittedFolders, ...submittedDocuments];

  // Get application status based on current status
  // const getApplicationStatus = () => {
  //   const baseStatus = [
  //     {
  //       title: "Application Submitted",
  //       completed: true,
  //       date: formatDate(applicationData.applied_date),
  //     },
  //     {
  //       title: "Application Review",
  //       completed: false,
  //       current: false,
  //       description: "Waiting for review to begin",
  //     },
  //     {
  //       title: "Interview Stage",
  //       completed: false,
  //       description: "If selected, you'll be invited for an interview",
  //     },
  //     {
  //       title: "Final Decision",
  //       completed: false,
  //       description: "Decisions will be made after all reviews and interviews",
  //     },
  //   ];

  //   if (applicationData.status === "Reviewing") {
  //     baseStatus[1].current = true;
  //     baseStatus[1].description = "Application is currently being reviewed";
  //   }

  //   return baseStatus;
  // };

  // const applicationStatus = getApplicationStatus();

  const handleDownload = (downloadUrl: string) => {
    // Handle document download
    window.open(downloadUrl, "_blank");
  };

  const handleContactOrganizer = () => {
    // For now, we'll use a placeholder email. In real implementation,
    // you might want to get organizer contact from event details
    window.location.href = `mailto:${user.email}`;
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Event Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Event Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Organizer</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Event Date</p>
            <p className="font-medium">{formatDate(eventInfo.start_date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-medium">{eventInfo.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-medium">{eventInfo.type}</p>
          </div>
        </div>
      </div>

      {/* Application Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Application Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Date Applied</p>
            <p className="font-medium">
              {formatDate(applicationData.applied_date)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {applicationData.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Documents</p>
            <p className="font-medium">
              {allSubmittedItems.length} items submitted (
              {submittedDocuments.length} files, {submittedFolders.length}{" "}
              folders)
            </p>
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Event Description</h3>
        <p className="text-gray-700 leading-relaxed">
          <RichTextDisplay
            content={eventInfo.description}
            className="text-sm"
          />
        </p>
      </div>

      {/* Application Responses */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Application Responses</h3>
        <div className="space-y-4">
          {applicationData.response.map((field, index) => (
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
        <Popup onClose={() => setFolderModal(false)} title="Folder Contents">
          <SharedFolderTree folderId={currentFolder} />
        </Popup>
      )}
    </div>
  );

  const renderDocumentsTab = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Submitted Documents & Folders
      </h3>
      <div className="space-y-4">
        {allSubmittedItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {item.type === "folder" ? (
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-red-500"
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
                )}
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.type === "folder" ? "Folder" : "File"} • Added{" "}
                  {item.dateAdded}
                </p>
              </div>
            </div>
            {item.type === "folder" ? (
              <button
                onClick={() => {
                  setCurrentFolder(item.id);
                  setFolderModal(true);
                }}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>View</span>
              </button>
            ) : (
              <button
                onClick={() => handleDownload(item.downloadUrl)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
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
                <span>Download</span>
              </button>
            )}
          </div>
        ))}
        {allSubmittedItems.length === 0 && (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-4"
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
            <p className="text-gray-500">No documents or folders submitted</p>
          </div>
        )}
      </div>
      {folderModal && currentFolder && (
        <Popup onClose={() => setFolderModal(false)} title="Folder Contents">
          <SharedFolderTree folderId={currentFolder} />
        </Popup>
      )}
    </div>
  );

  const renderFeedbackTab = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4">Judge Feedback</h3>
      {applicationData.judge_comment ? (
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{judge.name}</h4>
                <p className="text-sm text-gray-600">
                  Judge - {judge.expertise.join(", ")}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {applicationData.final_score && (
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(applicationData.final_score!)
                            ? "fill-current"
                            : "fill-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
                {applicationData.final_score && (
                  <span className="text-sm text-gray-600">
                    {applicationData.final_score}
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-700">{applicationData.judge_comment}</p>
            <p className="text-xs text-gray-500 mt-2">
              {formatDate(applicationData.review_date)}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.405L3 21l2.595-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
            />
          </svg>
          <p className="text-gray-500">No feedback available yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Feedback will be provided after your application is reviewed
          </p>
        </div>
      )}
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {eventInfo.title}
              </h1>
              <p className="text-gray-600 mt-1">
                Application #{applicationData.id.slice(-8)} •
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                  {applicationData.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "overview"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "documents"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab("feedback")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "feedback"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Feedback
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && renderOverviewTab()}
                {activeTab === "documents" && renderDocumentsTab()}
                {activeTab === "feedback" && renderFeedbackTab()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status */}
            {/* <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Application Status</h3>
              <div className="space-y-4">
                {applicationStatus.map((status, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {status.completed ? (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : status.current ? (
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                      ) : (
                        <div className="w-4 h-4 bg-gray-300 rounded-full" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          status.completed
                            ? "text-green-600"
                            : status.current
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {status.title}
                      </p>
                      {status.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {status.date}
                        </p>
                      )}
                      {status.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {status.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Judge Contact */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Organizer Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {user.email}
                  </div>
                </div>
                <div className="pt-3 space-y-2">
                  <button
                    onClick={handleContactOrganizer}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact Organizer
                  </button>
                  <button
                    onClick={() => {
                      navigate("/event/view/" + applicationData.event_id);
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Visit Event Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
