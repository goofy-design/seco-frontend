// API utility functions for insights data using your actual DB schema
import { InsightsData, Activity } from "@/types/insights";
import axiosInstance from "./axios";

// Your actual application data structure from DB
export interface ApplicationData {
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
    files: string[];
    folders: string[];
  }>;
}

// Transform your DB applications data into insights
export const transformApplicationsToInsights = (
  applications: ApplicationData[]
): InsightsData => {
  // Calculate total applications
  const totalApplications = applications.length;

  // Calculate reviewed applications (those with final_score or status != submitted)
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

  // Generate recent activities based on actual DB data
  const recentActivities = generateRecentActivities(applications);

  return {
    totalApplications,
    totalReviewed,
    averageScore,
    uniqueUsersRegistered,
    applicationsByStatus,
    recentActivities,
  };
};

// Generate recent activities from your actual application data
const generateRecentActivities = (
  applications: ApplicationData[]
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

  // Recent judge assignments
  const judgeAssignments = sortedApplications
    .filter((app) => app.judge_id && app.judgesDetails)
    .slice(0, 2);

  judgeAssignments.forEach((app) => {
    activities.push({
      id: `judge-${app.id}`,
      type: "judge_assigned",
      title: `Judge ${app.judgesDetails?.name} assigned to application`,
      timestamp: app.applied_date,
      metadata: {
        applicationId: app.id,
        judgeId: app.judge_id,
      },
    });
  });

  // Recent scores
  const scoredApplications = sortedApplications
    .filter((app) => app.final_score && app.final_score > 0)
    .slice(0, 2);

  scoredApplications.forEach((app) => {
    activities.push({
      id: `score-${app.id}`,
      type: "score_submitted",
      title: `Score ${app.final_score}/10 submitted for application`,
      timestamp: app.applied_date,
      metadata: {
        applicationId: app.id,
        score: app.final_score,
      },
    });
  });

  // Recent status changes (accepted/rejected)
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

  // Sort by timestamp and limit to 5 most recent
  return activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 5);
};

// Fetch insights using your existing API endpoint
export const fetchEventInsights = async (
  eventId: string
): Promise<InsightsData> => {
  try {
    const response = await axiosInstance.get(
      `/event-applications/all/event/${eventId}`
    );

    if (!response.data) {
      throw new Error("No data received from API");
    }

    const applications: ApplicationData[] = response.data.applications || [];

    return transformApplicationsToInsights(applications);
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw error;
  }
};

// Real-time updates using polling (since you're using REST API)
export const setupRealTimeInsights = (
  eventId: string,
  onUpdate: (data: InsightsData) => void,
  intervalMs: number = 30000 // 30 seconds default
) => {
  // Polling approach for real-time updates
  const interval = setInterval(async () => {
    try {
      const data = await fetchEventInsights(eventId);
      onUpdate(data);
    } catch (error) {
      console.error("Error in real-time update:", error);
    }
  }, intervalMs);

  // Return cleanup function
  return () => clearInterval(interval);
};

// Get mock data for development/fallback
export const getMockInsightsData = (
  applications?: ApplicationData[]
): InsightsData => {
  if (applications && applications.length > 0) {
    return transformApplicationsToInsights(applications);
  }

  return {
    totalApplications: 0,
    totalReviewed: 0,
    averageScore: 0,
    uniqueUsersRegistered: 0,
    applicationsByStatus: {
      "No applications": 1,
    },
    recentActivities: [
      {
        id: "no-data",
        type: "event_updated",
        title: "No recent activities",
        timestamp: new Date().toISOString(),
      },
    ],
  };
};
