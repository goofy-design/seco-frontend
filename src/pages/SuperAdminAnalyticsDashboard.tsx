import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
const mockAnalyticsData = {
  totalUsers: 2330,
  totalEvents: 42,
  totalApplications: 1523,
  conversionRate: 3.8,
  userGrowth: 12.5,
  eventGrowth: 8.3,
  appGrowth: 15.2,
  userDistribution: {} as { [key: string]: number },
  platformGrowth: {
    "7D": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      users: [45, 52, 48, 61, 55, 67, 59],
      events: [3, 5, 2, 7, 4, 8, 6],
      applications: [12, 18, 15, 23, 19, 28, 21],
    },
    "30D": {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      users: [180, 195, 210, 225],
      events: [8, 12, 10, 15],
      applications: [45, 52, 48, 58],
    },
    "90D": {
      labels: ["Month 1", "Month 2", "Month 3"],
      users: [650, 720, 810],
      events: [28, 35, 42],
      applications: [125, 145, 165],
    },
    "12M": {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      users: [1850, 2100, 2250, 2330],
      events: [25, 32, 38, 42],
      applications: [850, 1100, 1300, 1523],
    },
  },
  userActivity: {
    activeUsers: [
      900, 950, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1650, 1700, 1750,
      1800, 1750,
    ],
    newUsers: [
      200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850,
    ],
    returningUsers: [
      400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050,
    ],
  },
  pendingReview: 2,
  approved: 3,
  acquisitionChannels: {
    organic: 40,
    direct: 25,
    referrals: 15,
    social: 12,
    email: 8,
  },
  engagement: {
    profileViews: 15,
    eventViews: 3,
    downloads: 8,
  },
  eventCategories: {} as { [key: string]: number },
  applicationCategories: {} as { [key: string]: number },
  errorDistribution: {
    notFound: 41,
    validation: 32,
    forbidden: 7,
    server: 11,
    timeout: 9,
  },
};
const SuperAdminAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30D");
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);
  const [showExportMenu, setShowExportMenu] = useState(false);
  // Transform user registration data for line chart
  const transformUserActivityData = () => {
    // Generate user registration data based on API response and timeRange
    const generateUserRegistrationData = () => {
      const registrations: { [key: string]: number } = {};

      // Get the labels for current timeframe
      const currentLabels =
        mockAnalyticsData.platformGrowth[
          timeRange as keyof typeof mockAnalyticsData.platformGrowth
        ].labels;

      // Initialize all periods with 0
      currentLabels.forEach((label) => {
        registrations[label] = 0;
      });

      return currentLabels.map((label, index) => ({
        day: label,
        registeredUsers:
          analyticsData.platformGrowth[
            timeRange as keyof typeof analyticsData.platformGrowth
          ]?.users[index] || 0,
      }));
    };

    return generateUserRegistrationData();
  };

  // Transform user distribution data for pie chart
  const transformUserDistributionData = () => {
    return Object.entries(analyticsData.userDistribution).map(
      ([key, value]) => ({
        name:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        value: value,
      })
    );
  };

  // Colors for pie chart - extended to handle more roles
  const COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#f97316", // Orange
    "#06b6d4", // Cyan
    "#84cc16", // Lime
    "#f43f5e", // Rose
    "#6366f1", // Indigo
    "#14b8a6", // Teal
    "#a855f7", // Violet
    "#fb7185", // Pink
    "#fbbf24", // Amber
    "#34d399", // Emerald
    "#60a5fa", // Light Blue
  ];

  // Transform platform growth data for Recharts
  const transformDataForChart = () => {
    const currentData =
      analyticsData.platformGrowth[
        timeRange as keyof typeof analyticsData.platformGrowth
      ];
    if (!currentData) return [];

    return currentData.labels.map((label: string, index: number) => ({
      name: label,
      Users: currentData.users[index],
      Events: currentData.events[index],
      Applications: currentData.applications[index],
    }));
  };

  // Generate user distribution data based on API response
  const generateUserDistributionFromAPI = (users: any[]) => {
    const roleCounts: { [key: string]: number } = {};

    // Count users by role dynamically
    users.forEach((user) => {
      const role = user.role?.toLowerCase() || "unknown";

      // Normalize role name for better display
      let normalizedRole = role;
      switch (role) {
        case "user":
          normalizedRole = "regular";
          break;
        case "applicant":
          normalizedRole = "applicants";
          break;
        case "judge":
          normalizedRole = "judges";
          break;
        case "organizer":
        case "event_organizer":
          normalizedRole = "organizers";
          break;
        case "admin":
          normalizedRole = "admins";
          break;
        case "super_admin":
        case "superadmin":
        case "super-admin":
          normalizedRole = "superAdmins";
          break;
      }

      roleCounts[normalizedRole] = (roleCounts[normalizedRole] || 0) + 1;
    });

    // Convert counts to percentages
    const totalUsers = users.length;
    const distribution: { [key: string]: number } = {};

    Object.keys(roleCounts).forEach((role) => {
      distribution[role] =
        totalUsers > 0 ? Math.round((roleCounts[role] / totalUsers) * 100) : 0;
    });

    return distribution;
  };

  // Mock data for analytics
  // Generate platform growth data based on API response and timeRange
  const generatePlatformGrowthFromAPI = (
    users: any[],
    events: any[],
    applications: any[]
  ) => {
    const now = new Date();

    // Helper function to group data by time periods
    const groupDataByPeriod = (data: any[], dateField: string) => {
      const grouped: { [key: string]: number } = {};

      data.forEach((item) => {
        const itemDate = new Date(item[dateField]);
        let periodKey = "";

        switch (timeRange) {
          case "7D":
            // Group by day of week for last 7 days
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            periodKey = dayNames[itemDate.getDay()];
            break;
          case "30D":
            // Group by week for last 30 days
            const weekNumber = Math.ceil(
              (now.getTime() - itemDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
            );
            periodKey = `Week ${Math.max(1, 5 - weekNumber)}`;
            break;
          case "90D":
            // Group by month for last 90 days
            const monthNumber = Math.ceil(
              (now.getTime() - itemDate.getTime()) / (30 * 24 * 60 * 60 * 1000)
            );
            periodKey = `Month ${Math.max(1, 4 - monthNumber)}`;
            break;
          case "12M":
            // Group by quarter for last 12 months
            const quarterNumber = Math.ceil(
              (now.getTime() - itemDate.getTime()) / (90 * 24 * 60 * 60 * 1000)
            );
            periodKey = `Q${Math.max(1, 5 - quarterNumber)}`;
            break;
        }

        grouped[periodKey] = (grouped[periodKey] || 0) + 1;
      });

      return grouped;
    };

    // Get the labels for current timeframe
    const currentLabels =
      mockAnalyticsData.platformGrowth[
        timeRange as keyof typeof mockAnalyticsData.platformGrowth
      ].labels;

    // Group actual data
    const groupedUsers = groupDataByPeriod(users, "created_at");
    const groupedEvents = groupDataByPeriod(events, "created_at");
    const groupedApps = groupDataByPeriod(applications, "applied_date");
    // Create arrays with proper values or fallback to mock data
    const userData = currentLabels.map((label) => groupedUsers[label] || 0);
    const eventData = currentLabels.map((label) => groupedEvents[label] || 0);
    const appData = currentLabels.map((label) => groupedApps[label] || 0);
    return {
      ...mockAnalyticsData.platformGrowth,
      [timeRange]: {
        labels: currentLabels,
        users: userData,
        events: eventData,
        applications: appData,
      },
    };
  };

  // Calculate conversion rate from real data
  const calculateConversionRate = (events: any[], applications: any[]) => {
    if (events.length === 0) return 0;

    // Conversion Rate = (Total Applications / Total Events) × 100
    // This shows how many applications are generated per event on average
    const rate = (applications.length / events.length) * 100;
    return Math.round(rate * 10) / 10; // Round to 1 decimal place
  };

  const generateEventCategoriesFromAPI = (events: any[]) => {
    const categories: { [key: string]: number } = {};
    events.forEach((event) => {
      const category = event.type || "Uncategorized";
      categories[category] = (categories[category] || 0) + 1;
    });
    return categories;
  };

  const generateApplicationCategoriesFromAPI = (
    applications: any[],
    events: any[]
  ) => {
    const categories: { [key: string]: number } = {};

    // Create a map of event_id to event type for quick lookup
    const eventTypeMap: { [key: string]: string } = {};
    events.forEach((event) => {
      eventTypeMap[event.id] = event.type || "Uncategorized";
    });

    // Count applications by event type
    applications.forEach((app) => {
      const eventType = eventTypeMap[app.event_id] || "Uncategorized";
      categories[eventType] = (categories[eventType] || 0) + 1;
    });
    return categories;
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      const payload = {
        timeframe: timeRange,
      };
      const response = await axiosInstance.post(
        "/super-admin/analytics",
        payload
      );
      const data = response.data;
      const events = data.event;
      const applications = data.applications;
      const users = data.user;

      const formattedData = {
        ...analyticsData,
        totalUsers: users.length,
        totalEvents: events.length,
        totalApplications: applications.length,
        conversionRate: calculateConversionRate(events, applications),
        userDistribution: generateUserDistributionFromAPI(users),
        platformGrowth: generatePlatformGrowthFromAPI(
          users,
          events,
          applications
        ),
        pendingReview: applications.filter(
          (app: any) => app.final_score === null
        ).length,
        approved: applications.filter((app: any) => app.final_score !== null)
          .length,
        eventCategories: generateEventCategoriesFromAPI(events),
        applicationCategories: generateApplicationCategoriesFromAPI(
          applications,
          events
        ),
      };
      setAnalyticsData(formattedData);
      // Data would be fetched here
    } catch {
      setError("Failed to fetch analytics data");
      toast.error("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showExportMenu && !target.closest(".relative")) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportMenu]);

  const exportData = (format: "csv" | "json" | "pdf" = "csv") => {
    try {
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `analytics_${timestamp}`;

      if (format === "csv") {
        exportToCSV(filename);
      } else if (format === "json") {
        exportToJSON(filename);
      } else if (format === "pdf") {
        exportToPDF(filename);
      }

      toast.success(
        `Analytics data exported successfully as ${format.toUpperCase()}`
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export analytics data");
    }
  };

  const exportToCSV = (filename: string) => {
    const csvData = [];

    // Add summary data
    csvData.push(["Metric", "Value"]);
    csvData.push(["Total Users", analyticsData.totalUsers]);
    csvData.push(["Total Events", analyticsData.totalEvents]);
    csvData.push(["Total Applications", analyticsData.totalApplications]);
    csvData.push(["Conversion Rate", `${analyticsData.conversionRate}%`]);
    csvData.push([""]); // Empty row

    // Add platform growth data
    csvData.push(["Platform Growth Data"]);
    const platformData =
      analyticsData.platformGrowth[
        timeRange as keyof typeof analyticsData.platformGrowth
      ];
    csvData.push(["Period", "Users", "Events", "Applications"]);
    platformData.labels.forEach((label: string, index: number) => {
      csvData.push([
        label,
        platformData.users[index],
        platformData.events[index],
        platformData.applications[index],
      ]);
    });
    csvData.push([""]); // Empty row

    // Add user distribution data
    csvData.push(["User Distribution"]);
    csvData.push(["Role", "Percentage"]);
    Object.entries(analyticsData.userDistribution).forEach(
      ([role, percentage]) => {
        const displayName =
          role.charAt(0).toUpperCase() +
          role.slice(1).replace(/([A-Z])/g, " $1");
        csvData.push([displayName, `${percentage}%`]);
      }
    );

    // Convert to CSV string
    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (filename: string) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      timeRange,
      summary: {
        totalUsers: analyticsData.totalUsers,
        totalEvents: analyticsData.totalEvents,
        totalApplications: analyticsData.totalApplications,
        conversionRate: analyticsData.conversionRate,
      },
      platformGrowth:
        analyticsData.platformGrowth[
          timeRange as keyof typeof analyticsData.platformGrowth
        ],
      userDistribution: analyticsData.userDistribution,
      userActivity: analyticsData.userActivity,
      acquisitionChannels: analyticsData.acquisitionChannels,
      engagement: analyticsData.engagement,
      eventCategories: analyticsData.eventCategories,
      errorDistribution: analyticsData.errorDistribution,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (_filename: string) => {
    // Create a simple HTML content for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Analytics Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Analytics Dashboard Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Time Range: ${timeRange}</p>
        </div>
        
        <div class="section">
          <h2>Summary Metrics</h2>
          <div class="metric-grid">
            <div class="metric-card">
              <h3>Total Users</h3>
              <div class="metric-value">${analyticsData.totalUsers}</div>
            </div>
            <div class="metric-card">
              <h3>Total Events</h3>
              <div class="metric-value">${analyticsData.totalEvents}</div>
            </div>
            <div class="metric-card">
              <h3>Total Applications</h3>
              <div class="metric-value">${analyticsData.totalApplications}</div>
            </div>
            <div class="metric-card">
              <h3>Conversion Rate</h3>
              <div class="metric-value">${analyticsData.conversionRate}%</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>User Distribution</h2>
          <table>
            <thead>
              <tr><th>Role</th><th>Percentage</th></tr>
            </thead>
            <tbody>
              ${Object.entries(analyticsData.userDistribution)
                .map(([role, percentage]) => {
                  const displayName =
                    role.charAt(0).toUpperCase() +
                    role.slice(1).replace(/([A-Z])/g, " $1");
                  return `<tr><td>${displayName}</td><td>${percentage}%</td></tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Event Categories</h2>
          <table>
            <thead>
              <tr><th>Category</th><th>Percentage</th></tr>
            </thead>
            <tbody>
              ${Object.entries(analyticsData.eventCategories)
                .map(
                  ([category, percentage]) =>
                    `<tr><td>${
                      category.charAt(0).toUpperCase() + category.slice(1)
                    }</td><td>${percentage}%</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing/saving as PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();

      // Trigger print dialog after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const refreshData = () => {
    fetchAnalytics();
    toast.info("Refreshing analytics data...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg font-semibold">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <div className="text-gray-500">Please try again later.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container py-6 md:py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/super-admin">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10">
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
                    className="lucide lucide-arrow-left h-4 w-4"
                  >
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                  </svg>
                </button>
              </a>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Platform-wide metrics and insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Time Range Selector */}
              <div className="flex items-center gap-1 border rounded-md p-1">
                {["7D", "30D", "90D", "12M"].map((range) => (
                  <button
                    key={range}
                    className={`px-3 py-1 text-sm rounded ${
                      timeRange === range
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-100 text-red-800">
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
                  className="lucide lucide-shield w-3 h-3 mr-1"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>
                SuperAdmin
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="tracking-tight text-sm font-medium">
                    Total Users
                  </h3>
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">
                  {analyticsData.totalUsers}
                </div>
                {/* <div className="text-xs text-green-600">
                  +{analyticsData.userGrowth}% from previous period
                </div> */}
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="tracking-tight text-sm font-medium">
                    Total Events
                  </h3>
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">
                  {analyticsData.totalEvents}
                </div>
                {/* <div className="text-xs text-green-600">
                  +{analyticsData.eventGrowth}% from previous period
                </div> */}
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="tracking-tight text-sm font-medium">
                    Total Applications
                  </h3>
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">
                  {analyticsData.totalApplications}
                </div>
                {/* <div className="text-xs text-green-600">
                  +{analyticsData.appGrowth}% from previous period
                </div> */}
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="tracking-tight text-sm font-medium">
                    Conversion Rate
                  </h3>
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">
                  {analyticsData.conversionRate}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Applications per event
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
              tabIndex={0}
              data-orientation="horizontal"
              style={{ outline: "none" }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "overview"}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeTab === "overview"
                    ? "bg-background text-foreground shadow-sm"
                    : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "events"}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeTab === "events"
                    ? "bg-background text-foreground shadow-sm"
                    : ""
                }`}
                onClick={() => setActiveTab("events")}
              >
                Events
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "users"}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeTab === "users"
                    ? "bg-background text-foreground shadow-sm"
                    : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "applications"}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeTab === "applications"
                    ? "bg-background text-foreground shadow-sm"
                    : ""
                }`}
                onClick={() => setActiveTab("applications")}
              >
                Applications
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                onClick={refreshData}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Data
              </button>
              <div className="relative">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          exportData("csv");
                          setShowExportMenu(false);
                        }}
                      >
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Export as CSV
                        </div>
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          exportData("json");
                          setShowExportMenu(false);
                        }}
                      >
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                          </svg>
                          Export as JSON
                        </div>
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          exportData("pdf");
                          setShowExportMenu(false);
                        }}
                      >
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          Export as PDF
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Platform Growth Chart */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">
                          Platform Growth
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {timeRange === "7D" &&
                            "Daily trends for the last 7 days"}
                          {timeRange === "30D" &&
                            "Weekly trends for the last 30 days"}
                          {timeRange === "90D" &&
                            "Monthly trends for the last 90 days"}
                          {timeRange === "12M" &&
                            "Quarterly trends for the last 12 months"}
                        </p>
                      </div>
                      <div className="h-64 bg-white rounded-md border p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={transformDataForChart()}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            />
                            <Legend />
                            <Bar
                              dataKey="Users"
                              fill="#3b82f6"
                              name="Users"
                              radius={[2, 2, 0, 0]}
                            />
                            <Bar
                              dataKey="Events"
                              fill="#10b981"
                              name="Events"
                              radius={[2, 2, 0, 0]}
                            />
                            <Bar
                              dataKey="Applications"
                              fill="#f59e0b"
                              name="Applications"
                              radius={[2, 2, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* User Distribution */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">
                          User Distribution
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Breakdown of users by role
                        </p>
                      </div>
                      <div className="h-64 bg-white rounded-md border p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={transformUserDistributionData()}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                              labelLine={false}
                            >
                              {transformUserDistributionData().map(
                                (_, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`${value}%`, "Percentage"]}
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                        {Object.entries(analyticsData.userDistribution).map(
                          ([role, percentage], index) => {
                            // Format role name for display
                            const displayName =
                              role.charAt(0).toUpperCase() +
                              role.slice(1).replace(/([A-Z])/g, " $1");

                            return (
                              <div
                                key={role}
                                className="flex items-center gap-1"
                              >
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      COLORS[index % COLORS.length],
                                  }}
                                ></div>
                                <span className="truncate">
                                  {displayName}: {percentage}%
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "events" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Event Growth Chart */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">Event Growth</h3>
                        <p className="text-sm text-muted-foreground">
                          Event creation trends over time
                        </p>
                      </div>
                      <div className="h-64 bg-white rounded-md border p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={transformDataForChart()}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="Events"
                              stroke="#10b981"
                              fill="#10b981"
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Event Categories */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">
                          Event Categories
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Distribution by category
                        </p>
                      </div>
                      <div className="h-64 bg-white rounded-md border p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={Object.entries(
                                analyticsData.eventCategories
                              ).map(([category, percentage]) => ({
                                name:
                                  category.charAt(0).toUpperCase() +
                                  category.slice(1),
                                value: percentage,
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                              labelLine={false}
                            >
                              {Object.entries(
                                analyticsData.eventCategories
                              ).map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`${value}%`, "Percentage"]}
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Event Performance Table */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Event Performance Metrics
                    </h3>
                    <div className="rounded-lg border">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b bg-muted/50">
                            <tr>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                Category
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                Events Count
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                Percentage
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                Avg Applications
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {Object.entries(analyticsData.eventCategories).map(
                              ([category, percentage]) => (
                                <tr key={category}>
                                  <td className="p-4 align-middle font-medium">
                                    {category.charAt(0).toUpperCase() +
                                      category.slice(1)}
                                  </td>
                                  <td className="p-4 align-middle">
                                    {Math.floor(
                                      analyticsData.eventCategories[category] *
                                        percentage
                                    )}
                                  </td>
                                  <td className="p-4 align-middle">
                                    {percentage}%
                                  </td>
                                  <td className="p-4 align-middle">
                                    {(() => {
                                      const avgApps =
                                        (analyticsData.applicationCategories[
                                          category
                                        ] *
                                          percentage) /
                                        Math.floor(
                                          analyticsData.eventCategories[
                                            category
                                          ] * percentage
                                        );
                                      return isNaN(avgApps)
                                        ? "0"
                                        : avgApps.toFixed(2);
                                    })()}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {/* User Activity */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">
                          User Registration
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Number of users registered over time
                        </p>
                      </div>
                      <div className="h-64 bg-white rounded-md border p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={transformUserActivityData()}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="registeredUsers"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              name="Registered Users"
                              dot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Shows the number of users who registered during the
                        selected time period
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Event Categories
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Distribution of events by category
                        </p>
                        <div className="space-y-2">
                          {Object.entries(analyticsData.eventCategories).map(
                            ([category, value]) => (
                              <div
                                key={category}
                                className="flex justify-between items-center"
                              >
                                <span className="text-sm capitalize">
                                  {category}
                                </span>
                                <span className="text-sm font-medium">
                                  {(
                                    (value / analyticsData.totalEvents) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "applications" && (
                <div className="space-y-6">
                  {/* Application Stats Summary */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col space-y-1.5 p-6 py-3">
                        <div className="flex items-center justify-between">
                          <h3 className="tracking-tight text-sm font-medium">
                            Total Applications
                          </h3>
                          <svg
                            className="h-4 w-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">
                          {analyticsData.totalApplications}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col space-y-1.5 p-6 py-3">
                        <div className="flex items-center justify-between">
                          <h3 className="tracking-tight text-sm font-medium">
                            Pending Review
                          </h3>
                          <svg
                            className="h-4 w-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">
                          {analyticsData.pendingReview}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col space-y-1.5 p-6 py-3">
                        <div className="flex items-center justify-between">
                          <h3 className="tracking-tight text-sm font-medium">
                            Approved
                          </h3>
                          <svg
                            className="h-4 w-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">
                          {analyticsData.approved}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col space-y-1.5 p-6 py-3">
                        <div className="flex items-center justify-between">
                          <h3 className="tracking-tight text-sm font-medium">
                            Pending Rate
                          </h3>
                          <svg
                            className="h-4 w-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">
                          {(
                            (analyticsData.pendingReview /
                              analyticsData.totalApplications) *
                            100
                          ).toFixed(2)}
                          %
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Application Trends */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">
                          Application Trends
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Application submissions over time
                        </p>
                      </div>
                      <div className="h-64 bg-white rounded-md border p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={transformDataForChart()}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="Applications"
                              stroke="#f59e0b"
                              fill="#f59e0b"
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Application Status Distribution */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">
                          Application Status
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Current status distribution
                        </p>
                      </div>
                      <div className="h-64 bg-white rounded-md border p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                {
                                  name: "Pending",
                                  value: analyticsData.pendingReview,
                                },
                                {
                                  name: "Approved",
                                  value: analyticsData.approved,
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                              labelLine={false}
                            >
                              <Cell fill="#f59e0b" />
                              <Cell fill="#10b981" />
                              <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`${value}`, "Value"]}
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Application Performance by Event Category */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Applications by Event Category
                    </h3>
                    <div className="h-64 bg-white rounded-md border p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={Object.entries(
                            analyticsData.eventCategories
                          ).map(([category, percentage]) => ({
                            name:
                              category.charAt(0).toUpperCase() +
                              category.slice(1),
                            applications:
                              analyticsData.applicationCategories[category] ||
                              0,
                            events: percentage,
                          }))}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              fontSize: "12px",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="applications"
                            fill="#f59e0b"
                            name="Applications"
                            radius={[2, 2, 0, 0]}
                          />
                          <Bar
                            dataKey="events"
                            fill="#3b82f6"
                            name="Events"
                            radius={[2, 2, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Application Quality Metrics */}
                  {/* <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Application Quality Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium text-sm mb-2">
                          Average Score
                        </h4>
                        <div className="text-2xl font-bold text-blue-600">
                          8.2/10
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Based on judge evaluations
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium text-sm mb-2">
                          Completion Rate
                        </h4>
                        <div className="text-2xl font-bold text-green-600">
                          92%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Fully completed applications
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium text-sm mb-2">
                          Time to Complete
                        </h4>
                        <div className="text-2xl font-bold text-purple-600">
                          45min
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Average time spent
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAnalyticsDashboard;
