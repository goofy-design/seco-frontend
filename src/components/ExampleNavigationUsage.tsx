// Example of how to navigate to application details with data
import { useNavigate } from "react-router-dom";

const ExampleNavigationComponent = () => {
  const navigate = useNavigate();

  // Example function to navigate to application details
  const navigateToApplicationDetails = (applicationData: any) => {
    navigate(`/applications/${applicationData.id}`, {
      state: {
        applicationData: applicationData,
      },
    });
  };

  // Example usage with your API response data
  const handleViewApplication = () => {
    const sampleData = {
      id: "8ff42d10-c629-4294-bed5-67ef29394284",
      applied_date: "2025-07-30T08:45:29.825+00:00",
      status: "Reviewing",
      judge_comment: null,
      judge_id: "f842bfbd-2994-47b4-8dae-b8a7bc95b9dc",
      event_id: "310c5309-08bc-4428-ab9e-136b5db4820e",
      user_id: "6da37151-bac9-44c1-af39-05a6b1af24fe",
      final_score: null,
      review_date: "2025-07-30T08:45:30.271125+00:00",
      evaluation_scores: {},
      user: {
        id: "6da37151-bac9-44c1-af39-05a6b1af24fe",
        created_at: "2025-07-28T18:57:02.255+00:00",
        name: "Shrut",
        email: "shrutvd@gmail.com",
        role: "user",
        status: "pending",
      },
      judgesDetails: {
        id: "f842bfbd-2994-47b4-8dae-b8a7bc95b9dc",
        created_at: "2025-07-30T09:26:49.477008+00:00",
        name: "Shrut Doshi",
        event_id: "310c5309-08bc-4428-ab9e-136b5db4820e",
        email: "shrutvd@gmail.com",
        expertise: ["AI/ML"],
      },
      eventsDetails: [
        {
          id: "310c5309-08bc-4428-ab9e-136b5db4820e",
          title: "Seco",
          description: "This is Demo",
          start_date: "2025-07-02",
          type: "hackathon",
          location: "Gandhinagar, Gujarat, India",
          created_at: "2025-07-30T08:40:15.156273+00:00",
          updated_at: "2025-07-30T08:40:15.156273+00:00",
          created_by: "6da37151-bac9-44c1-af39-05a6b1af24fe",
          website: "https://www.google.com/",
          banner: "https://example.com/banner.jpg",
          judges_emails: [],
          stages: [],
          coordinates: [23.2156354, 72.63694149999999],
          evaluation_criteria: [],
        },
      ],
      response: [
        {
          id: "9b4220cc-fc76-438d-a17e-1632b19c1936",
          user_id: "6da37151-bac9-44c1-af39-05a6b1af24fe",
          event_id: "310c5309-08bc-4428-ab9e-136b5db4820e",
          submitted_at: "2025-07-30T08:45:29.825+00:00",
          question: "Name",
          answer: "Shrut Doshi",
          application_id: "8ff42d10-c629-4294-bed5-67ef29394284",
          type: "text",
          files: [],
          folders: [],
        },
      ],
    };

    navigateToApplicationDetails(sampleData);
  };

  return (
    <button
      onClick={handleViewApplication}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      View Application Details
    </button>
  );
};

export default ExampleNavigationComponent;
