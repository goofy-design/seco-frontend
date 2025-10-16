// Types for insights functionality

export interface InsightsData {
  totalApplications: number;
  totalReviewed: number;
  averageScore: number;
  uniqueUsersRegistered: number;
  applicationsByStatus: Record<string, number>;
  recentActivities: Activity[];
}

export interface Activity {
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

// Additional types that might be useful
export interface ApplicationStatus {
  submitted: number;
  reviewing: number;
  under_review: number;
  accepted: number;
  approved: number;
  rejected: number;
  [key: string]: number; // Allow for custom status types
}

export interface InsightsApiResponse {
  success: boolean;
  data: InsightsData;
  message?: string;
  timestamp: string;
}

export interface RealtimeInsightsConfig {
  eventId: string;
  updateInterval?: number; // in milliseconds
  enableWebSocket?: boolean;
  onUpdate: (data: InsightsData) => void;
  onError?: (error: Error) => void;
}
