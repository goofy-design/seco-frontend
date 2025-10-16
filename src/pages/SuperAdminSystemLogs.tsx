import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SystemLog {
  id: string;
  time: string;
  severity: string;
  message: string;
  source: string;
  user: string;
  ip: string;
}

// Utility hook for click outside
// function useClickOutside(ref: React.RefObject<HTMLDivElement | null>, onClose: () => void) {
//   React.useEffect(() => {
//     function handleClick(event: MouseEvent) {
//       if (ref.current && !ref.current.contains(event.target as Node)) {
//         onClose();
//       }
//     }
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, [ref, onClose]);
// }

const SuperAdminSystemLogs = () => {
//   const navigate = useNavigate();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [fromDate, setFromDate] = useState("2025-07-07");
  const [toDate, setToDate] = useState("2025-07-14");
  const [activeTab, setActiveTab] = useState("all");

  // Dummy data - replace with actual API call
  const dummyLogs: SystemLog[] = [
    {
      id: "1",
      time: "2025-07-14 10:30:25",
      severity: "error",
      message: "Database connection failed",
      source: "Database",
      user: "system",
      ip: "192.168.1.100"
    },
    {
      id: "2",
      time: "2025-07-14 10:25:15",
      severity: "warning",
      message: "High memory usage detected",
      source: "System Monitor",
      user: "admin",
      ip: "192.168.1.101"
    },
    {
      id: "3",
      time: "2025-07-14 10:20:45",
      severity: "info",
      message: "User login successful",
      source: "Authentication",
      user: "john.doe",
      ip: "192.168.1.102"
    },
    {
      id: "4",
      time: "2025-07-14 10:15:30",
      severity: "success",
      message: "Backup completed successfully",
      source: "Backup Service",
      user: "system",
      ip: "192.168.1.100"
    },
    {
      id: "5",
      time: "2025-07-14 10:10:20",
      severity: "error",
      message: "API rate limit exceeded",
      source: "API Gateway",
      user: "api.user",
      ip: "192.168.1.103"
    },
    {
      id: "6",
      time: "2025-07-14 10:05:10",
      severity: "warning",
      message: "SSL certificate expires in 30 days",
      source: "Security",
      user: "system",
      ip: "192.168.1.100"
    },
    {
      id: "7",
      time: "2025-07-14 10:00:05",
      severity: "info",
      message: "System startup completed",
      source: "System",
      user: "system",
      ip: "192.168.1.100"
    },
    {
      id: "8",
      time: "2025-07-14 09:55:45",
      severity: "success",
      message: "User registration completed",
      source: "User Management",
      user: "jane.smith",
      ip: "192.168.1.104"
    },
    {
      id: "9",
      time: "2025-07-14 09:50:30",
      severity: "error",
      message: "Payment processing failed",
      source: "Payment Gateway",
      user: "payment.service",
      ip: "192.168.1.105"
    },
    {
      id: "10",
      time: "2025-07-14 09:45:15",
      severity: "warning",
      message: "Disk space running low",
      source: "File System",
      user: "system",
      ip: "192.168.1.100"
    },
    {
      id: "11",
      time: "2025-07-14 09:40:10",
      severity: "info",
      message: "Cache cleared successfully",
      source: "Cache Service",
      user: "admin",
      ip: "192.168.1.101"
    },
    {
      id: "12",
      time: "2025-07-14 09:35:25",
      severity: "success",
      message: "Email sent successfully",
      source: "Email Service",
      user: "notification.service",
      ip: "192.168.1.106"
    },
    {
      id: "13",
      time: "2025-07-14 09:30:40",
      severity: "error",
      message: "Authentication token expired",
      source: "Authentication",
      user: "expired.user",
      ip: "192.168.1.107"
    },
    {
      id: "14",
      time: "2025-07-14 09:25:55",
      severity: "info",
      message: "Configuration updated",
      source: "Configuration",
      user: "admin",
      ip: "192.168.1.101"
    },
    {
      id: "15",
      time: "2025-07-14 09:20:20",
      severity: "warning",
      message: "Service response time high",
      source: "Performance Monitor",
      user: "system",
      ip: "192.168.1.100"
    }
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call
        // const res = await axiosInstance.get(API_CONSTANTS.GET_ALL_SYSTEM_LOGS);
        // let data = res?.data?.data;
        
        // Using dummy data for now
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        setLogs(dummyLogs);
      } catch {
        setError("Failed to fetch system logs");
        toast.error("Failed to fetch system logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === "" || log.severity === selectedSeverity;
    const matchesTab = activeTab === "all" || log.severity === activeTab;
    return matchesSearch && matchesSeverity && matchesTab;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSeverity("");
    setFromDate("2025-07-07");
    setToDate("2025-07-14");
  };

  const exportLogs = () => {
    // Implement export functionality
    toast.success("Logs exported successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg font-semibold">Loading system logs...</div>
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
                  System Logs
                </h1>
                <p className="text-muted-foreground">
                  View and analyze system activity logs
                </p>
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shield w-3 h-3 mr-1"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>
                SuperAdmin
              </div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                Admin User
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Total Logs</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{logs.length}</div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Errors</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-red-600">
                  {logs.filter(log => log.severity === 'error').length}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Warnings</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-yellow-600">
                  {logs.filter(log => log.severity === 'warning').length}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Info</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-blue-600">
                  {logs.filter(log => log.severity === 'info').length}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Success</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-green-600">
                  {logs.filter(log => log.severity === 'success').length}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
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
                  aria-selected={activeTab === "all"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "all" ? "bg-background text-foreground shadow-sm" : ""
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Logs
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "error"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "error" ? "bg-background text-foreground shadow-sm" : ""
                  }`}
                  onClick={() => setActiveTab("error")}
                >
                  Errors
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "warning"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "warning" ? "bg-background text-foreground shadow-sm" : ""
                  }`}
                  onClick={() => setActiveTab("warning")}
                >
                  Warnings
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "system"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "system" ? "bg-background text-foreground shadow-sm" : ""
                  }`}
                  onClick={() => setActiveTab("system")}
                >
                  System
                </button>
              </div>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                onClick={exportLogs}
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
                  className="lucide lucide-download mr-2 h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                Export Logs
              </button>
            </div>

            {/* Filters */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex-1 max-w-md">
                    <input
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
                      placeholder="Search logs by message, user, or source..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Severity</span>
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                      >
                        <option value="">All Severity</option>
                        <option value="error">Error</option>
                        <option value="warning">Warning</option>
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">From</span>
                      <input
                        type="date"
                        className="border rounded px-2 py-1 text-xs"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">To</span>
                      <input
                        type="date"
                        className="border rounded px-2 py-1 text-xs"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 mt-3"
                      onClick={resetFilters}
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
                        className="lucide lucide-filter mr-1 h-3 w-3"
                      >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      Reset
                    </button>
                  </div>
                </div>

                {/* Logs Table */}
                <div className="overflow-x-auto">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                            Time
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                            Severity
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                            Message
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                            Source
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                            User
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                            IP
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[_tr:last-child]:border-0">
                        {filteredLogs.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-gray-500">
                              No logs found matching your criteria
                            </td>
                          </tr>
                        ) : (
                          filteredLogs.map((log) => (
                            <tr key={log.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              <td className="p-4 align-middle">{log.time}</td>
                              <td className="p-4 align-middle">
                                <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground ${getSeverityColor(log.severity)}`}>
                                  {log.severity}
                                </div>
                              </td>
                              <td className="p-4 align-middle max-w-md">
                                <div className="truncate" title={log.message}>
                                  {log.message}
                                </div>
                              </td>
                              <td className="p-4 align-middle">{log.source}</td>
                              <td className="p-4 align-middle">{log.user}</td>
                              <td className="p-4 align-middle">{log.ip}</td>
                              <td className="p-4 align-middle">
                                <button
                                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                                  onClick={() => {
                                    // Implement view details functionality
                                    toast.info(`Viewing details for log: ${log.id}`);
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="items-center flex justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredLogs.length} of {logs.length} logs
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                    Previous
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSystemLogs;