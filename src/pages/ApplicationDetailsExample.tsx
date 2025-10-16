import ApplicationDetails from "./ApplicationsDetails";

// Example usage of the ApplicationDetails component with your API response data
const ApplicationDetailsExample = () => {
  // This is the data structure that should come from your API
  const sampleApplicationData = {
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
      password: "$2a$10$SYfrpdwD1gPmx.dsGPr6DOaeUCPJhHy243frpdzH9Vzjp2tuTFFEu",
      role: "user",
      reset_password_token: null,
      reset_password_expires: null,
      updated_at: "2025-07-30T08:36:49.088+00:00",
      auth_type: "Others",
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
        banner:
          "https://kdudtccfqrskbwkgrurv.supabase.co/storage/v1/object/public/uploads/event-banners/1753864814313-Event-Banners.jpg",
        judges_emails: [],
        stages: [
          {
            id: "1",
            name: "Enroll",
            description: "",
            start_date: "2025-07-02",
            start_time: "",
          },
          {
            id: "1753864795930",
            name: "Results",
            description: "",
            start_date: "2025-07-10",
            start_time: "",
          },
        ],
        coordinates: [23.2156354, 72.63694149999999],
        evaluation_criteria: [],
      },
    ],
    response: [
      {
        id: "ae26a413-02ca-4cfb-82dd-5723a52f084a",
        user_id: "6da37151-bac9-44c1-af39-05a6b1af24fe",
        event_id: "310c5309-08bc-4428-ab9e-136b5db4820e",
        submitted_at: "2025-07-30T08:45:29.825+00:00",
        question: "Resume",
        answer: "",
        application_id: "8ff42d10-c629-4294-bed5-67ef29394284",
        type: "file",
        files: ["694ff352-ad1a-470d-9d1d-9d0658fbb495"],
        folders: ["8a039c86-9407-4f99-9046-64be3f87f894"],
        filesData: [
          {
            id: "694ff352-ad1a-470d-9d1d-9d0658fbb495",
            name: "event.webp",
            storage_path:
              "https://kdudtccfqrskbwkgrurv.supabase.co/storage/v1/object/public/uploads/vault/1753865016604-event.webp",
          },
        ],
        foldersData: [
          {
            id: "8a039c86-9407-4f99-9046-64be3f87f894",
            name: "Resumes",
          },
        ],
      },
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
      {
        id: "aa84419a-26bc-44b0-b247-0890157b6046",
        user_id: "6da37151-bac9-44c1-af39-05a6b1af24fe",
        event_id: "310c5309-08bc-4428-ab9e-136b5db4820e",
        submitted_at: "2025-07-30T08:45:29.825+00:00",
        question: "Gender",
        answer: "Male",
        application_id: "8ff42d10-c629-4294-bed5-67ef29394284",
        type: "radio",
        files: [],
        folders: [],
      },
      {
        id: "1734c4cd-434e-4989-811e-1979aefbb42a",
        user_id: "6da37151-bac9-44c1-af39-05a6b1af24fe",
        event_id: "310c5309-08bc-4428-ab9e-136b5db4820e",
        submitted_at: "2025-07-30T08:45:29.825+00:00",
        question: "Address",
        answer:
          "F-1, Suprabhat Apt.,\nGulab Tower Road,\nThaltej,\nAhmedabad - 380054",
        application_id: "8ff42d10-c629-4294-bed5-67ef29394284",
        type: "textarea",
        files: [],
        folders: [],
      },
    ],
  };

  return <ApplicationDetails applicationData={sampleApplicationData} />;
};

export default ApplicationDetailsExample;
