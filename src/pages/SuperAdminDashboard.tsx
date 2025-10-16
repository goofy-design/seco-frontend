import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="container py-6 md:py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                SuperAdmin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage all aspects of the platform from one place
              </p>
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
          <div className="rounded-lg border bg-card shadow-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Welcome, SuperAdmin
              </h3>
              <p className="text-sm text-blue-100">
                You have full access to all platform settings and data
              </p>
            </div>
            <div className="p-6 pt-0">
              <p>
                This dashboard provides centralized access to all administrative
                functions. Please use your powers responsibly.
              </p>
            </div>
            <div className="flex items-center p-6 pt-0">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
                View System Status
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="bg-blue-100 p-4">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "25%",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0 }}>
                    <div className="flex items-center justify-center h-full">
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
                        className="lucide lucide-users w-8 h-8 text-blue-500"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  User Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage users, roles, and permissions
                </p>
              </div>
              <div className="flex items-center p-6 pt-0">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  onClick={() => navigate("/super-admin/users")}
                >
                  Access User Management
                </button>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="bg-green-100 p-4">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "25%",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0 }}>
                    <div className="flex items-center justify-center h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-calendar w-8 h-8 text-green-500"
                      >
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Event Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Oversee all events and applications
                </p>
              </div>
              <div className="flex items-center p-6 pt-0">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  onClick={() => navigate("/super-admin/events")}
                >
                  Access Event Management
                </button>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="bg-purple-100 p-4">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "25%",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0 }}>
                    <div className="flex items-center justify-center h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-settings2 w-8 h-8 text-purple-500"
                      >
                        <path d="M20 7h-9"></path>
                        <path d="M14 17H5"></path>
                        <circle cx="17" cy="17" r="3"></circle>
                        <circle cx="7" cy="7" r="3"></circle>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  System Settings
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure system-wide settings
                </p>
              </div>
              <div className="flex items-center p-6 pt-0">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  onClick={() => navigate("/super-admin/settings")}
                >
                  Access System Settings
                </button>
              </div>
            </div>
            {/* <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="bg-orange-100 p-4">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "25%"
                  }}
                >
                  <div style={{ position: "absolute", inset: 0 }}>
                    <div className="flex items-center justify-center h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-activity w-8 h-8 text-orange-500"
                      >
                        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  System Logs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Review activity and error logs
                </p>
              </div>
              <div className="flex items-center p-6 pt-0">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  onClick={() => navigate("/super-admin/logs")}
                >
                  Access System Logs
                </button>
              </div>
            </div> */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="bg-pink-100 p-4">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "25%",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0 }}>
                    <div className="flex items-center justify-center h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-chart-no-axes-column-increasing w-8 h-8 text-pink-500"
                      >
                        <line x1="12" x2="12" y1="20" y2="10"></line>
                        <line x1="18" x2="18" y1="20" y2="4"></line>
                        <line x1="6" x2="6" y1="20" y2="16"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Analytics Dashboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  Platform-wide metrics and insights
                </p>
              </div>
              <div className="flex items-center p-6 pt-0">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  onClick={() => navigate("/super-admin/analytics")}
                >
                  Access Analytics Dashboard
                </button>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="bg-indigo-100 p-4">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "25%",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0 }}>
                    <div className="flex items-center justify-center h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-ticket w-8 h-8 text-indigo-500"
                      >
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                        <path d="M13 5v2"></path>
                        <path d="M13 17v2"></path>
                        <path d="M13 11v2"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Subscription Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage plans, modules, and user subscriptions
                </p>
              </div>
              <div className="flex items-center p-6 pt-0">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  onClick={() => navigate("/super-admin/subscriptions")}
                >
                  Access Subscription Management
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
