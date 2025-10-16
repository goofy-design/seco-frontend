import { useEffect, useState, useMemo } from "react";
import YourUpcomEvents from "../components/YourUpcomEvents";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

interface UserData {
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
  login_attempt: number;
  files: number;
  accountData: {
    id: string;
    company_description: string | null;
    company_name: string | null;
    website: string | null;
    avatar_url: string | null;
    location: string | null;
    date: string | null;
    industry: string | null;
    email_notification: boolean;
    new_event_notification: boolean;
    user_id: string;
    full_name: string;
    showInvestors: boolean;
  };
}

interface Event {
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
  coordinates: number[];
  evaluation_criteria: {
    name: string;
    weight: number;
    description: string;
  }[];
  location_name: string;
  statuses: string[];
}

// Chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Removed static weeklyEngagementData - will be replaced with dynamic monthly applications data

const Dashboard = () => {
  const [registeredEvent, setRegisteredEvent] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const myEvents = events.filter((event) => event.created_by === userData?.id);

  // Generate event type distribution data based on events
  const eventTypeData = useMemo(() => {
    const typeCount: Record<string, number> = {};
    events.forEach((event) => {
      typeCount[event.type] = (typeCount[event.type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
    }));
  }, [events]);

  // Generate monthly applications data from registered events
  const monthlyApplicationsData = useMemo(() => {
    const monthCount: Record<string, number> = {};

    registeredEvent.forEach((event) => {
      // Use the event's start_date to group by month
      const eventDate = new Date(event.start_date);
      const monthKey = eventDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });

      monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
    });

    // Sort by date and return formatted data
    return Object.entries(monthCount)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([month, applications]) => ({
        month,
        applications,
      }));
  }, [registeredEvent]);

  const fetchRegisteredEvent = async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem("user");
      const userId = userData ? JSON.parse(userData).id : 123; // Replace with actual user ID
      const response = await axiosInstance.get(
        `/event-applications/user/${userId}/events`
      );
      const data = response.data;
      console.log("Registered events data:", data);
      setRegisteredEvent(data.events);
    } catch (error: any) {
      console.error("Error fetching registered events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/events");
      const data = response.data;
      console.log("All events data:", data);
      setEvents(data.events);
    } catch (error: any) {
      console.error("Error fetching all events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem("user");
      const userId = userData ? JSON.parse(userData).id : 123; // Replace with actual user ID
      const response = await axiosInstance.get(`/account/detail/${userId}`);
      const data = response.data;
      console.log("User data:", data);
      setUserData(data);
      // Handle user data as needed
    } catch (error: any) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredEvent();
    fetchAllEvents();
    fetchUserData();
  }, []);

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {userData?.accountData?.full_name || userData?.name}.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
            <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Total Applications
              </h3>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
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
                  className="lucide lucide-calendar h-4 w-4"
                >
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M3 10h18"></path>
                </svg>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{registeredEvent.length}</div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
            <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Total Events
              </h3>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
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
                  className="lucide lucide-users h-4 w-4"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{events.length}</div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
            <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Document Uploads
              </h3>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
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
                  className="lucide lucide-link2 h-4 w-4"
                >
                  <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
                  <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
                  <line x1="8" x2="16" y1="12" y2="12"></line>
                </svg>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{userData?.files}</div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
            <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Profile Completion
              </h3>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
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
                  className="lucide lucide-chart-column h-4 w-4"
                >
                  <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                  <path d="M18 17V9"></path>
                  <path d="M13 17V5"></path>
                  <path d="M8 17v-3"></path>
                </svg>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">
                {userData?.accountData
                  ? (() => {
                      const fields = [
                        "company_description",
                        "company_name",
                        "website",
                        "avatar_url",
                        "location",
                        "date",
                        "industry",
                        "full_name",
                      ];
                      const completedFields = fields.filter(
                        (field) =>
                          userData.accountData[
                            field as keyof typeof userData.accountData
                          ] != null &&
                          userData.accountData[
                            field as keyof typeof userData.accountData
                          ] !== ""
                      ).length;
                      return Math.round(
                        (completedFields / fields.length) * 100
                      );
                    })()
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>

        {/* Registered Events Section */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-8 animate-fade-in">
          <div className="space-y-1.5 p-6 flex flex-row items-center justify-between">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Your Registered Events
            </h3>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              onClick={() => navigate("/events")}
            >
              Find More Events
            </button>
          </div>
          <div className="p-6 pt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {registeredEvent.map((event, index) => (
                <div
                  key={event.id || index}
                  className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                      {event.type}
                    </span>
                  </div>
                  <h3 className="font-medium text-base mt-2">{event.title}</h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
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
                        className="lucide lucide-calendar h-4 w-4"
                      >
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                      <span>{event.start_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>
                        {new Date(event.start_date).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Event Types Distribution Chart */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in overflow-hidden">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Event Types Distribution
              </h3>
            </div>
            <div className="p-6 pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                      name,
                      percent,
                    }: {
                      name: string;
                      percent?: number;
                    }) =>
                      `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventTypeData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Connections Growth Chart */}
          {/* <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in overflow-hidden"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Connections Growth
              </h3>
            </div>
            <div className="p-6 pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={connectionGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="connections"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#fff", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div> */}

          {/* Monthly Applications Chart */}
          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm lg:col-span-2 animate-fade-in overflow-hidden"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Applications by Month
              </h3>
              <p className="text-sm text-muted-foreground">
                Track your event applications grouped by month
              </p>
            </div>
            <div className="p-6 pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyApplicationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      `${name === "applications" ? "Applications" : name}`,
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="applications"
                    fill="#3B82F6"
                    name="Applications"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <YourUpcomEvents events={myEvents} />
          {/* <RecentConnections /> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
