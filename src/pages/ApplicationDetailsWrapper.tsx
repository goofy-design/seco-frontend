import { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ApplicationDetails from "./ApplicationsDetails";
import { IEventApplication } from "../reudux/slices/eventApplicationSlice";

// Type for the application data that can come from different sources
type ApplicationData = {
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
    password?: string;
    reset_password_token?: string | null;
    reset_password_expires?: string | null;
    updated_at?: string;
    auth_type?: string;
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

interface ApplicationDetailsState {
  applicationData?: ApplicationData | IEventApplication;
}

// Helper function to normalize the data structure
const normalizeApplicationData = (
  data: ApplicationData | IEventApplication
): ApplicationData => {
  // If it's already in the correct format, return it
  if ("review_date" in data && "judgesDetails" in data) {
    return data as ApplicationData;
  }

  // Convert IEventApplication to ApplicationData format
  const ieventApp = data as IEventApplication;
  const normalized: ApplicationData = {
    ...ieventApp,
    judge_id: ieventApp.judge_id || ieventApp.event_id, // Use event_id as fallback
    review_date: ieventApp.applied_date,
    evaluation_scores: {},
    judgesDetails: {
      id: ieventApp.judge_id || ieventApp.event_id,
      created_at: new Date().toISOString(),
      name: "Judge",
      event_id: ieventApp.event_id,
      email: "judge@example.com",
      expertise: [],
    },
  };

  return normalized;
};

const ApplicationDetailsWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as ApplicationDetailsState;
  const rawApplicationData = state?.applicationData;

  useEffect(() => {
    // If no application data is passed via navigation state, redirect to applications page
    if (!rawApplicationData) {
      console.warn(
        "No application data found in navigation state. Redirecting to applications page."
      );
      navigate("/applications", { replace: true });
      return;
    }

    // Optional: Verify that the application ID from URL matches the data
    if (rawApplicationData.id !== id) {
      console.warn(
        "Application ID mismatch. Redirecting to applications page."
      );
      navigate("/applications", { replace: true });
      return;
    }
  }, [rawApplicationData, id, navigate]);

  // Show loading or nothing while redirecting
  if (!rawApplicationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  // Normalize the data to ensure it matches the expected format
  const applicationData = normalizeApplicationData(rawApplicationData);

  return <ApplicationDetails applicationData={applicationData} />;
};

export default ApplicationDetailsWrapper;
