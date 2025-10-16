import { useEffect, useState } from "react";
import API_CONSTANTS from "../utils/apiConstants";
import axiosInstance from "../utils/axios";
import { toast } from "sonner";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  name: string;
  organizer: string;
  status: string;
  date: string;
  applications: string;
  views: string;
}

// Utility hook for click outside
function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  onClose: () => void
) {
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
}

const SuperAdminEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState(false);
  const deleteModalRef = React.useRef<HTMLDivElement>(null);
  const editModalRef = React.useRef<HTMLDivElement>(null);
  const viewModalRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(deleteModalRef, () => {
    if (showDeleteModal) {
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  });
  useClickOutside(editModalRef, () => {
    if (showEditModal) {
      setShowEditModal(false);
      setSelectedEvent(null);
    }
  });
  useClickOutside(viewModalRef, () => {
    if (showViewModal) {
      setShowViewModal(false);
      setSelectedEvent(null);
    }
  });

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(
          API_CONSTANTS.GET_ALL_EVENTS_SUPER_ADMIN
        );
        let data = res?.data?.data;
        if (!Array.isArray(data)) {
          data = [];
        }
        setEvents(data);
      } catch {
        setError("Failed to fetch events data");
        toast.error("Failed to fetch events data");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events based on active tab, search query, and status filter
  const filteredEvents = events.filter((event) => {
    // Filter by tab
    if (activeTab === "active" && event.status !== "active") return false;
    if (activeTab === "pending" && event.status !== "pending") return false;

    // Filter by search query
    if (
      searchQuery &&
      !event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by status dropdown
    if (statusFilter && event.status !== statusFilter) return false;

    return true;
  });

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await axiosInstance.delete(API_CONSTANTS.DELETE_EVENT(selectedEvent.id));
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      setShowDeleteModal(false);
      setSelectedEvent(null);
      toast.success("Event deleted successfully");
    } catch {
      toast.error("Failed to delete event");
    }
  };

  // Handle approve/reject event status update
  const handleStatusUpdate = async (
    eventId: string,
    newStatus: "active" | "blocked"
  ) => {
    setUpdating(true);
    try {
      await axiosInstance.patch(API_CONSTANTS.UPDATE_EVENT_STATUS(eventId), {
        status: newStatus,
      });

      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      );

      toast.success(
        `Event ${newStatus === "active" ? "approved" : "rejected"} successfully`
      );
    } catch {
      toast.error(
        `Failed to ${newStatus === "active" ? "approve" : "reject"} event`
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setActiveTab("all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg font-semibold">Loading events...</div>
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

  if (!events || events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500 text-lg font-semibold mb-2">
            No events found.
          </div>
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
              {/* <a href="/super-admin"> */}
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10"
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
              {/* </a> */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Event Management
                </h1>
                <p className="text-muted-foreground">
                  Manage all events in the system
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center rounded-full border_px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-100 text-red-800">
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">
                  Total Events
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">
                  {events ? events.length : 0}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Active</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-green-600">
                  {events.filter((e) => e.status === "active").length}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Pending</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-yellow-600">
                  {events.filter((e) => e.status === "pending").length}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">Blocked</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-red-600">
                  {events.filter((e) => e.status === "blocked").length}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 py-2">
                <h3 className="tracking-tight text-sm font-medium">
                  Total Applications
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold text-blue-600">
                  {events.reduce((sum, e) => sum + parseInt(e.applications), 0)}
                </div>
              </div>
            </div>
          </div>
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
                    activeTab === "all"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Events
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "active"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "active"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("active")}
                >
                  Active
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "pending"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "pending"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("pending")}
                >
                  Pending
                </button>
              </div>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                onClick={() => navigate(`/event`)}
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
                  className="lucide lucide-calendar-plus mr-2 h-4 w-4"
                >
                  <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"></path>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                  <line x1="19" x2="19" y1="14" y2="20"></line>
                  <line x1="16" x2="22" y1="17" y2="17"></line>
                </svg>
                Add Event
              </button>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex-1 max-w-md">
                    <input
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
                      placeholder="Search events by name or organizer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        Status
                      </span>
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="active">active</option>
                        <option value="pending">pending</option>
                        <option value="blocked">blocked</option>
                      </select>
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 mt-3"
                      onClick={handleResetFilters}
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
                        className="lucide lucide-filter mr-1 h-3 w-3"
                      >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      Reset
                    </button>
                  </div>
                </div>
                <div
                  role="tabpanel"
                  className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 m-0"
                >
                  <div className="overflow-x-auto">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Name
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Organizer
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Status
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Date
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Applications
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Views
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[_tr:last-child]:border-0">
                          {filteredEvents.length === 0 ? (
                            <tr>
                              <td
                                colSpan={7}
                                className="text-center py-8 text-gray-500"
                              >
                                No events found.
                              </td>
                            </tr>
                          ) : (
                            filteredEvents.map((event) => (
                              <tr
                                key={event.id}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                              >
                                <td className="p-4 align-middle flex items-center gap-2">
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
                                    className="lucide lucide-calendar h-4 w-4 text-muted-foreground"
                                  >
                                    <rect
                                      x="3"
                                      y="4"
                                      width="18"
                                      height="18"
                                      rx="2"
                                      ry="2"
                                    ></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                  </svg>
                                  {event.name}
                                </td>
                                <td className="p-4 align-middle">
                                  {event.organizer}
                                </td>
                                <td className="p-4 align-middle">
                                  <div
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground ${
                                      event.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : event.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : event.status === "blocked"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-secondary text-secondary-foreground"
                                    }`}
                                  >
                                    {event.status}
                                  </div>
                                </td>
                                <td className="p-4 align-middle">
                                  {event.date}
                                </td>
                                <td className="p-4 align-middle">
                                  {event.applications}
                                </td>
                                <td className="p-4 align-middle">
                                  {event.views}
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="flex space-x-2">
                                    <button
                                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9 rounded-md"
                                      onClick={() => {
                                        setSelectedEvent(event);
                                        setShowEditModal(true);
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                      </svg>
                                    </button>
                                    <button
                                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9 rounded-md"
                                      onClick={() => {
                                        setSelectedEvent(event);
                                        setShowViewModal(true);
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                    </button>

                                    <button
                                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 h-9 w-9 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100"
                                      onClick={() => {
                                        setSelectedEvent(event);
                                        setShowDeleteModal(true);
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                      </svg>
                                    </button>
                                    {event.status === "pending" && (
                                      <>
                                        <button
                                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 h-9 w-9 rounded-md text-green-500 hover:text-green-700 hover:bg-green-100"
                                          onClick={() =>
                                            handleStatusUpdate(
                                              event.id,
                                              "active"
                                            )
                                          }
                                          disabled={updating}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M20 6 9 17l-5-5" />
                                          </svg>
                                        </button>
                                        <button
                                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 h-9 w-9 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100"
                                          onClick={() =>
                                            handleStatusUpdate(
                                              event.id,
                                              "blocked"
                                            )
                                          }
                                          disabled={updating}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M18 6 6 18" />
                                            <path d="m6 6 12 12" />
                                          </svg>
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="items-center flex justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredEvents.length} of {events.length} events
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
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
          >
            <div className="mb-4 text-lg font-semibold">
              Are you sure you want to delete this event?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEvent(null);
                }}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={editModalRef}
            className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
          >
            <div className="mb-4 text-lg font-semibold">
              Are you sure you want to edit this Event?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedEvent(null);
                }}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() =>
                  navigate(`/event/${selectedEvent?.id}`, { replace: true })
                }
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={editModalRef}
            className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
          >
            <div className="mb-4 text-lg font-semibold">
              Are you sure you want to view this Event?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedEvent(null);
                }}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() =>
                  navigate(`/event/view/${selectedEvent?.id}`, {
                    replace: true,
                  })
                }
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminEvents;
