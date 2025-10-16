import { EventInterface } from "@/types/event";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/utils/axios";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "sonner";

// Types based on your actual API response structure
interface ApplicationResponse {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  judge_id?: string;
  judgesDetails?: {
    name: string;
  };
  final_score?: number;
  applied_date: string;
  response?: Array<{
    id: string;
    user_id: string;
    event_id: string;
    submitted_at: string;
    question: string;
    answer: string;
    application_id: string;
    type: string;
  }>;
}

// Types for dynamic insights data
interface InsightsData {
  totalApplications: number;
  totalReviewed: number;
  averageScore: number;
  uniqueUsersRegistered: number;
  applicationsByStatus: Record<string, number>;
  recentActivities: Activity[];
}

interface Activity {
  id: string;
  type:
    | "application_submitted"
    | "status_changed"
    | "score_submitted"
    | "judge_assigned"
    | "user_registered"
    | "event_updated";
  title: string;
  description?: string;
  timestamp: string;
  metadata?: {
    applicationId?: string;
    userId?: string;
    judgeId?: string;
    oldStatus?: string;
    newStatus?: string;
    score?: number;
  };
}

// Function to transform API data to insights
const transformApplicationsToInsights = (
  applications: ApplicationResponse[]
): InsightsData => {
  // Calculate total applications
  const totalApplications = applications.length;

  // Calculate reviewed applications (those with final_score or status != 'submitted')
  const reviewedApplications = applications.filter(
    (app) =>
      (app.final_score !== undefined && app.final_score !== null) ||
      (app.status && app.status.toLowerCase() !== "submitted")
  );
  const totalReviewed = reviewedApplications.length;

  // Calculate average score
  const scoredApplications = applications.filter(
    (app) =>
      app.final_score !== undefined &&
      app.final_score !== null &&
      app.final_score > 0
  );
  const averageScore =
    scoredApplications.length > 0
      ? Number(
          (
            scoredApplications.reduce(
              (sum, app) => sum + (app.final_score || 0),
              0
            ) / scoredApplications.length
          ).toFixed(1)
        )
      : 0;

  // Count unique users
  const uniqueUserIds = new Set(applications.map((app) => app.user.id));
  const uniqueUsersRegistered = uniqueUserIds.size;

  // Calculate applications by status
  const applicationsByStatus: Record<string, number> = {};
  applications.forEach((app) => {
    const status = app.status || "unknown";
    applicationsByStatus[status] = (applicationsByStatus[status] || 0) + 1;
  });

  // Generate recent activities from application data
  const recentActivities = generateRecentActivitiesFromDB(applications);

  return {
    totalApplications,
    totalReviewed,
    averageScore,
    uniqueUsersRegistered,
    applicationsByStatus,
    recentActivities,
  };
};

// Generate recent activities from DB data
const generateRecentActivitiesFromDB = (
  applications: ApplicationResponse[]
): Activity[] => {
  const activities: Activity[] = [];
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Sort applications by application date
  const sortedApplications = [...applications].sort(
    (a, b) =>
      new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime()
  );

  // Recent submissions (last 24 hours)
  const recentSubmissions = sortedApplications.filter(
    (app) => new Date(app.applied_date) > oneDayAgo
  );

  if (recentSubmissions.length > 0) {
    activities.push({
      id: `submissions-recent`,
      type: "application_submitted",
      title: `${recentSubmissions.length} new application${
        recentSubmissions.length > 1 ? "s" : ""
      } submitted`,
      timestamp: recentSubmissions[0].applied_date,
    });
  }

  // Recent status changes (applications with judges assigned)
  const recentJudgeAssignments = sortedApplications
    .filter((app) => app.judge_id && app.judgesDetails)
    .slice(0, 2);

  recentJudgeAssignments.forEach((app) => {
    activities.push({
      id: `judge-${app.id}`,
      type: "judge_assigned",
      title: `Judge ${app.judgesDetails?.name} assigned to application`,
      timestamp: app.applied_date, // Using applied_date as we don't have assignment date
    });
  });

  // Recent scores
  const recentScores = sortedApplications
    .filter((app) => app.final_score && app.final_score > 0)
    .slice(0, 2);

  recentScores.forEach((app) => {
    activities.push({
      id: `score-${app.id}`,
      type: "score_submitted",
      title: `Score ${app.final_score}/10 submitted for application`,
      timestamp: app.applied_date, // Using applied_date as we don't have score submission date
      metadata: {
        applicationId: app.id,
        score: app.final_score,
      },
    });
  });

  // Recent accepted/rejected applications
  const statusChanges = sortedApplications
    .filter((app) =>
      ["accepted", "rejected", "approved"].includes(
        app.status?.toLowerCase() || ""
      )
    )
    .slice(0, 2);

  statusChanges.forEach((app) => {
    activities.push({
      id: `status-${app.id}`,
      type: "status_changed",
      title: `Application ${
        app.status?.toLowerCase() === "approved"
          ? "approved"
          : app.status?.toLowerCase()
      }`,
      timestamp: app.applied_date,
      metadata: {
        applicationId: app.id,
        newStatus: app.status,
      },
    });
  });

  // Sort activities by timestamp (most recent first) and limit to 5
  return activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 5);
};

// Utility function to calculate time ago
const getTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInMinutes = Math.floor(
    (now.getTime() - activityTime.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
};

// Function to get activity display info
const getActivityDisplayInfo = (activity: Activity) => {
  const baseInfo = {
    title: activity.title,
    time: getTimeAgo(activity.timestamp),
  };

  switch (activity.type) {
    case "application_submitted":
      return {
        ...baseInfo,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        status: "New",
      };
    case "status_changed":
      const isAccepted = activity.metadata?.newStatus === "accepted";
      const isRejected = activity.metadata?.newStatus === "rejected";
      return {
        ...baseInfo,
        bgColor: isAccepted
          ? "bg-green-100"
          : isRejected
          ? "bg-red-100"
          : "bg-yellow-100",
        textColor: isAccepted
          ? "text-green-800"
          : isRejected
          ? "text-red-800"
          : "text-yellow-800",
        status: isAccepted ? "Accepted" : isRejected ? "Rejected" : "Updated",
      };
    case "score_submitted":
      return {
        ...baseInfo,
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        status: "Scored",
      };
    case "judge_assigned":
      return {
        ...baseInfo,
        bgColor: "bg-indigo-100",
        textColor: "text-indigo-800",
        status: "Assigned",
      };
    case "user_registered":
      return {
        ...baseInfo,
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-800",
        status: "Registered",
      };
    default:
      return {
        ...baseInfo,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        status: "Updated",
      };
  }
};

type MetricCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  suffix?: string;
};

const MetricCard = ({ title, value, icon, suffix = "" }: MetricCardProps) => (
  <div className="bg-white rounded-lg border shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
          {icon}
          {title}
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {value}
          {suffix}
        </div>
      </div>
    </div>
  </div>
);

type ProgressBarProps = {
  percentage: number;
  color?: string;
};

const ProgressBar = ({
  percentage,
  color = "bg-blue-500",
}: ProgressBarProps) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className={`${color} h-2 rounded-full transition-all duration-300`}
      style={{ width: `${percentage}%` }}
    />
  </div>
);

// Add types for StatusChart and RecentActivity

type StatusChartProps = {
  data: Record<string, number>;
  title: string;
};

const StatusChart = ({ data, title }: StatusChartProps) => {
  // Calculate total applications
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  // Calculate percentages
  const statusWithPercentages = Object.entries(data).map(([status, count]) => ({
    status,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {statusWithPercentages.map(({ status, count, percentage }) => (
          <div key={status} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  status === "submitted"
                    ? "bg-purple-100 text-purple-800"
                    : status === "reviewing" || status === "under_review"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "accepted" || status === "approved"
                    ? "bg-green-100 text-green-800"
                    : status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace("_", " ")}
              </span>
              <ProgressBar
                percentage={percentage}
                color={
                  status === "submitted"
                    ? "bg-purple-500"
                    : status === "reviewing" || status === "under_review"
                    ? "bg-yellow-500"
                    : status === "accepted" || status === "approved"
                    ? "bg-green-500"
                    : status === "rejected"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }
              />
            </div>
            <div className="text-sm text-gray-600 min-w-0 flex items-center gap-2">
              <span className="font-medium">{count}</span>
              <span className="text-gray-500">({percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

type RecentActivityProps = {
  activities: Activity[];
};

const RecentActivity = ({ activities }: RecentActivityProps) => (
  <div className="bg-white rounded-lg border shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Recent Activity
    </h3>
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No recent activities
        </p>
      ) : (
        activities.map((activity) => {
          const displayInfo = getActivityDisplayInfo(activity);
          return (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {displayInfo.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{displayInfo.time}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${displayInfo.bgColor} ${displayInfo.textColor}`}
              >
                {displayInfo.status}
              </span>
            </div>
          );
        })
      )}
    </div>
  </div>
);

const OverallInsights: React.FC<{
  eventData: EventInterface;
  insightsData?: InsightsData;
  onRefresh?: () => void;
}> = ({ eventData, insightsData, onRefresh }) => {
  const { id: eventIdFromParam } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InsightsData>({
    totalApplications: 0,
    totalReviewed: 0,
    averageScore: 0,
    uniqueUsersRegistered: 0,
    applicationsByStatus: {},
    recentActivities: [],
  });
  const [error, setError] = useState<string | null>(null);

  // Function to fetch insights data from your API
  const fetchInsightsData = async () => {
    if (!eventIdFromParam && !eventData?.id) {
      console.error("No event ID available");
      return;
    }

    const eventId = eventIdFromParam || eventData.id;
    setLoading(true);
    setError(null);

    try {
      // Use the same API endpoint as Participants component
      const response = await axiosInstance.get(
        `/event-applications/all/event/${eventId}`
      );

      const apiData = response.data;
      const applications: ApplicationResponse[] = apiData.applications || [];

      // Transform the API data to insights
      const calculatedInsights = transformApplicationsToInsights(applications);

      // Use provided insightsData if available, otherwise use calculated data
      setData(insightsData || calculatedInsights);
    } catch (error) {
      console.error("Error fetching insights data:", error);
      setError("Failed to load insights data");

      // Fallback to mock data in case of error
      const fallbackData: InsightsData = {
        totalApplications: 0,
        totalReviewed: 0,
        averageScore: 0,
        uniqueUsersRegistered: 0,
        applicationsByStatus: {
          "No data": 1,
        },
        recentActivities: [
          {
            id: "error-1",
            type: "event_updated",
            title: "Unable to load recent activities",
            timestamp: new Date().toISOString(),
          },
        ],
      };
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, [eventIdFromParam, eventData?.id, insightsData]);

  const handleRefresh = () => {
    fetchInsightsData();
    onRefresh?.();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          Loading insights...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load insights
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-6 md:py-8 max-w-6xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Overall Insights
              </h1>
              <p className="text-muted-foreground">
                Track and analyze your application performance with real-time
                data.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Applications"
              value={data.totalApplications}
              icon={
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />
            <MetricCard
              title="Applications Reviewed"
              value={data.totalReviewed}
              icon={
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              }
            />
            <MetricCard
              title="Average Score"
              value={data.averageScore}
              suffix="/10"
              icon={
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              }
            />
            <MetricCard
              title="Unique Users"
              value={data.uniqueUsersRegistered}
              icon={
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />
          </div>

          {/* Application Status Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <StatusChart
              data={data.applicationsByStatus}
              title="Application Status Distribution"
            />
          </div>

          {/* Recent Activity */}
          <RecentActivity activities={data.recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default OverallInsights;
