import Popup from "@/components/Popup";
import SharedFolderTree from "@/components/SharedFolderTree";
import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface EvaluationCriteria {
  score?: number;
  weight: number;
  name: string;
  description: string | null;
}

interface Response {
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
  filesData?: {
    id: string;
    name: string;
    storage_path: string;
  }[];
  foldersData?: {
    id: string;
    name: string;
  }[];
}

interface ApplicationInterface {
  id: string;
  applied_date: string;
  status: string;
  judge_comment: string | null;
  judge_id: string;
  event_id: string;
  user_id: string;
  final_score: number | null;
  user: {
    id: string;
    created_at: string;
    name: string;
    email: string;
    password: string;
    role: string;
    reset_password_token: string | null;
    reset_password_expires: string | null;
    updated_at: string;
    auth_type: string;
    status: string;
  };
  response: Response[];
  review_date: string | null;
}

interface EventInterface {
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
  coordinates: [number, number];
  evaluation_criteria: EvaluationCriteria[];
}

const Judge = () => {
  const { eventId, judgeId } = useParams<{
    eventId: string;
    judgeId: string;
  }>();
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderModal, setFolderModal] = useState(false);
  const [eventData, setEventData] = useState<EventInterface | null>(null);
  const [totalApplications, setTotalApplications] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("Reviewing");
  const [isLoading, setIsLoading] = useState(false);
  const [applications, setApplications] = useState<ApplicationInterface[]>([]);

  // State for evaluation scores for each application
  const [evaluationScores, setEvaluationScores] = useState<{
    [applicationId: string]: { [criteriaName: string]: number };
  }>({});

  // State for feedback comments for each application
  const [feedbackComments, setFeedbackComments] = useState<{
    [applicationId: string]: string;
  }>({});

  const handleSubmit = async (applicationId: string) => {
    try {
      // Validate that all criteria are scored
      if (!isApplicationReadyForSubmission(applicationId)) {
        toast.error("Please score all criteria before submitting");
        return;
      }

      // Get evaluation scores for this application
      const scores = evaluationScores[applicationId] || {};
      const comment = feedbackComments[applicationId] || "";

      // Calculate final score based on weighted average
      let totalWeightedScore = 0;
      let totalWeight = 0;

      if (eventData?.evaluation_criteria) {
        eventData.evaluation_criteria.forEach((criteria) => {
          const score = scores[criteria.name] || 0;
          totalWeightedScore += score * criteria.weight;
          totalWeight += criteria.weight;
        });
      }

      const finalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

      const payload = {
        application_id: applicationId,
        judge_id: judgeId,
        evaluation_scores: scores,
        judge_comment: comment,
        // status: "Accepted", // Assuming status is "Accepted" after review
        final_score: Math.round(finalScore * 100) / 100, // Round to 2 decimal places
        review_date: new Date().toISOString(),
        criteria_scores:
          eventData?.evaluation_criteria?.map((criteria) => ({
            name: criteria.name,
            score: scores[criteria.name] || 0,
            weight: criteria.weight,
          })) || [],
      };
      await axiosInstance.put(`/judge/review/${applicationId}`, payload);
      toast.success("Review submitted successfully");

      // Update the application status locally
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === applicationId
            ? {
                ...app,
                // status: "Accepted",
                final_score: Math.round(finalScore * 100) / 100,
                judge_comment: comment,
                review_date: new Date().toISOString(),
              }
            : app
        )
      );
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  useEffect(() => {
    const fetchJudge = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/judge/${eventId}/${judgeId}`
        );
        const data = response.data;
        const eveData = data.event;
        setEventData(eveData);
        const userResponse = data.data;
        const formattedApplications: ApplicationInterface[] = userResponse.map(
          (app: ApplicationInterface) => {
            return {
              id: app.id || "app-id",
              applied_date: app.applied_date || "2023-10-01",
              status: app.status || "",
              judge_comment: app.judge_comment || null,
              judge_id: judgeId || "",
              event_id: eventId || "",
              user_id: app.user_id || "user-id",
              final_score: app.final_score || null,
              user: {
                id: app.user.id || "user-id",
                created_at: app.user.created_at || "2023-10-01",
                name: app.user.name || "John Doe",
                email: app.user.email || "john.doe@example.com",
              },
              response: app.response || [],
              review_date: app.review_date || null,
            };
          }
        );
        setApplications(formattedApplications);
        // const data = response.data.events;
      } catch (error: any) {
        toast.error("failed to fetch the event details for judge evaluation");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJudge();
  }, []);

  useEffect(() => {
    if (eventData) {
      const total = applications.length;
      const pending = applications.filter(
        (app) => app.final_score === null
      ).length;
      const Accepted = applications.filter((app) =>
        app.final_score === null ? false : true
      ).length;

      setTotalApplications(total);
      setPendingReviews(pending);
      setReviewProgress(total > 0 ? Math.round((Accepted / total) * 100) : 0);
    }
  }, [applications, eventData]);

  const updateEvaluation = (
    applicationId: string,
    criteriaName: string,
    newScore: number
  ): void => {
    // Update evaluation scores state
    setEvaluationScores((prev) => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        [criteriaName]: newScore,
      },
    }));
  };

  const updateFeedback = (applicationId: string, comment: string): void => {
    setFeedbackComments((prev) => ({
      ...prev,
      [applicationId]: comment,
    }));
  };

  const calculateAverageScore = (applicationId: string): number => {
    const scores = evaluationScores[applicationId] || {};

    if (!eventData?.evaluation_criteria) return 0;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    eventData.evaluation_criteria.forEach((criteria) => {
      const score = scores[criteria.name] || 0;
      totalWeightedScore += score * criteria.weight;
      totalWeight += criteria.weight;
    });

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const isApplicationReadyForSubmission = (applicationId: string): boolean => {
    const scores = evaluationScores[applicationId] || {};

    if (!eventData?.evaluation_criteria) return false;

    // Check if all criteria have been scored (score > 0)
    return eventData.evaluation_criteria.every(
      (criteria) => scores[criteria.name] && scores[criteria.name] > 0
    );
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "Reviewing") return app.final_score === null;
    if (activeTab === "Accepted")
      return app.final_score === null ? false : true;
    return true;
  });
  const renderApplicationCards = () => {
    if (isLoading) {
      return (
        <div>
          <div className="mt-16 pt-4">
            <div className="container mx-auto py-8 px-4">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "all") {
      return (
        <div className="mt-4">
          <div className="rounded-lg border shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left">Startup</th>
                    <th className="px-4 py-3 text-left">Event</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    {/* <th className="px-4 py-3 text-left">Score</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{app.user.name}</div>
                        <div className="text-gray-500 text-xs">
                          {app.user.email || "no founder"}
                        </div>
                      </td>
                      <td className="px-4 py-3">{eventData?.title || "-"}</td>
                      <td className="px-4 py-3">
                        {app.applied_date
                          ? new Date(app.applied_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === "Reviewing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                      </td>
                      {/* <td className="px-4 py-3">{app.final_score || "-"}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-6">
        {filteredApplications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg border shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{app.user.name}</h2>
                    <p className="text-gray-500">
                      Founder: {app.user.email || "-"}
                    </p>
                  </div>
                  {(app.final_score === null ? false : true) ? (
                    <div className="mt-2 lg:mt-0 text-right">
                      <div className="text-3xl font-bold">
                        {app.final_score || "-"}
                      </div>
                      <div className="text-gray-500 text-sm">Score</div>
                    </div>
                  ) : (
                    <div className="mt-2 lg:mt-0 text-right">
                      <div className="text-3xl font-bold">
                        {calculateAverageScore(app.id).toFixed(1)}
                      </div>
                      <div className="text-gray-500 text-sm">Current Score</div>
                    </div>
                  )}
                </div>

                {app.final_score !== null && app.judge_comment && (
                  <div className="mt-4">
                    <h3 className="font-medium">Your Feedback:</h3>
                    <p className="text-gray-600 mt-1">{app.judge_comment}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {app.review_date
                        ? new Date(app.review_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                )}

                {app.final_score === null && (
                  <>
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">
                        Application Responses
                      </h3>
                      <div className="bg-gray-50 rounded-lg border border-gray-200 shadow p-4">
                        {app.response?.map((response) => (
                          <div
                            key={response.id}
                            className="bg-white rounded-lg border border-gray-200 p-4 mb-4 last:mb-0"
                          >
                            <p className="font-semibold mb-1">
                              {response.question}
                            </p>
                            {response.type === "file" ? (
                              <div className="space-y-2">
                                {response.folders &&
                                  response.folders.length > 0 &&
                                  response?.foldersData?.map(
                                    (file, fileIndex) => (
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
                                    )
                                  )}
                                {response.files &&
                                  response.files.length > 0 &&
                                  response?.filesData?.map(
                                    (file, fileIndex) => (
                                      <div
                                        key={fileIndex}
                                        className="flex items-center text-sm cursor-pointer hover:underline"
                                        onClick={() => {
                                          window.open(
                                            `${file.storage_path}`,
                                            "_blank"
                                          );
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
                                    )
                                  )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600 break-words">
                                {response.answer}
                              </p>
                            )}
                            {/* <p className="text-gray-600">{response.answer}</p> */}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-4 text-lg">
                        Evaluation Criteria
                      </h3>
                      <div className="space-y-5">
                        {eventData?.evaluation_criteria?.map((criteria) => {
                          const score =
                            evaluationScores[app.id]?.[criteria.name] ?? 0;

                          return (
                            <div
                              key={criteria.name}
                              className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold text-gray-800 capitalize">
                                    {criteria.name}
                                  </p>
                                  {criteria.description && (
                                    <p className="text-gray-500 text-sm mt-1">
                                      {criteria.description}
                                    </p>
                                  )}
                                </div>
                                <span className="text-gray-500 text-sm whitespace-nowrap">
                                  Weight: {criteria.weight}%
                                </span>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <select
                                    className="appearance-none w-16 h-10 pl-3 pr-8 border border-gray-300 rounded-md bg-white text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={score}
                                    onChange={(e) => {
                                      const newScore = parseInt(
                                        e.target.value,
                                        10
                                      );
                                      updateEvaluation(
                                        app.id,
                                        criteria.name,
                                        newScore
                                      );
                                    }}
                                  >
                                    {[0, 1, 2, 3, 4, 5].map((val) => (
                                      <option key={val} value={val}>
                                        {val}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg
                                      className="w-4 h-4 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </div>
                                </div>

                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${(score / 5) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Feedback & Comments</h3>
                      <textarea
                        className="w-full p-3 border rounded-md text-sm"
                        rows={4}
                        placeholder="Provide feedback for the startup team..."
                        value={feedbackComments[app.id] || ""}
                        onChange={(e) => updateFeedback(app.id, e.target.value)}
                      ></textarea>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        className={`px-4 py-2 rounded-md text-white transition-colors ${
                          isApplicationReadyForSubmission(app.id)
                            ? "bg-blue-900 hover:bg-blue-800"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (isApplicationReadyForSubmission(app.id)) {
                            handleSubmit(app.id);
                          } else {
                            toast.error(
                              "Please score all criteria before submitting"
                            );
                          }
                        }}
                        disabled={!isApplicationReadyForSubmission(app.id)}
                      >
                        Submit Review
                      </button>
                    </div>
                  </>
                )}
              </div>
              {folderModal && currentFolder && (
                <Popup onClose={() => setFolderModal(false)}>
                  <SharedFolderTree
                    folderId={currentFolder}
                    showFileActions={true}
                    allowDownload={true}
                  />
                </Popup>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Judge Dashboard</h1>
          <p className="text-gray-600">
            Review and evaluate startup applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-gray-600 mb-1">Total Applications</h2>
            <div className="text-3xl font-bold">{totalApplications}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-gray-600 mb-1">Pending Reviews</h2>
            <div className="text-3xl font-bold">{pendingReviews}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-gray-600 mb-1">Review Progress</h2>
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${reviewProgress}%` }}
                ></div>
              </div>
              <div className="text-right text-sm mt-1">{reviewProgress}%</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div
            className="inline-flex rounded-md shadow-sm bg-gray-100 p-1"
            role="tablist"
          >
            <button
              onClick={() => setActiveTab("Reviewing")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "Reviewing"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending (
              {applications.filter((app) => app.final_score === null).length})
            </button>
            <button
              onClick={() => setActiveTab("Accepted")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "Accepted"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviewed (
              {
                applications.filter((app) =>
                  app.final_score === null ? false : true
                ).length
              }
              )
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "all"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Applications ({applications.length})
            </button>
          </div>
        </div>

        {renderApplicationCards()}
      </div>
    </div>
  );
};

export default Judge;
