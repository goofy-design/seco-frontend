import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneralSettings from "./SuperAdminGeneralSetting";
import SecuritySettings from "./SuperAdminSecuritySetting";
import NotificationSettings from "./SuperAdminNotificationSetting";
import IntegrationSettings from "./SuperAdminIntegrationSetting";

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "security":
        return <SecuritySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "integrations":
        return <IntegrationSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10"
            onClick={() => navigate("/super-admin")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-arrow-left h-4 w-4"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">Configure system-wide settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-100 text-red-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-shield w-3 h-3 mr-1"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            </svg>{" "}
            SuperAdmin
          </div>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            Admin User
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div
          role="tablist"
          aria-orientation="horizontal"
          className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-4 mb-6"
        >
          <button
            type="button"
            role="tab"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${activeTab === "general" ? "bg-background text-foreground shadow-sm" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-globe mr-2 h-4 w-4"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>
            General
          </button>

          <button
            type="button"
            role="tab"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${activeTab === "security" ? "bg-background text-foreground shadow-sm" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shield-check mr-2 h-4 w-4"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            Security
          </button>

          <button
            type="button"
            role="tab"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${activeTab === "notifications" ? "bg-background text-foreground shadow-sm" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bell mr-2 h-4 w-4"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
            Notifications
          </button>

          <button
            type="button"
            role="tab"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${activeTab === "integrations" ? "bg-background text-foreground shadow-sm" : ""}`}
            onClick={() => setActiveTab("integrations")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-server mr-2 h-4 w-4"
            >
              <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
              <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
              <line x1="6" x2="6.01" y1="6" y2="6"></line>
              <line x1="6" x2="6.01" y1="18" y2="18"></line>
            </svg>
            Integrations
          </button>
        </div>
        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SuperAdmin;