import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "./../reudux/store";
import { selectIsLoggedIn } from "./../reudux/slices/authSlice";
import { useAppSelector } from "@/reudux/hooks/hooks";
import axiosInstance from "@/utils/axios";
import { updateEventSlice, updateLoading } from "@/reudux/slices/eventSlice";
import { toast } from "sonner";
import RichTextDisplay from "@/components/RichTextDisplay";

const EventDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const events = useAppSelector((state) => state.event);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
  const [filteredEvents, setFilteredEvents] = useState(events.data || []);

  useEffect(() => {
    if (events.data) {
      const types = Array.from(
        new Set(events.data.map((event) => event.type || "Unknown"))
      );
      setEventTypes(["all", ...types]);
      const locations = Array.from(
        new Set(events.data.map((event) => event.location || "Unknown"))
      );
      setUniqueLocations(["all", ...locations]);
    }
  }, [events.data]);

  useEffect(() => {
    const filtered =
      events.data?.filter((event) => {
        const matchesSearch =
          event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType =
          selectedType === "all" || event.type === selectedType;
        const matchesLocation =
          selectedLocation === "all" || event.location === selectedLocation;

        return matchesSearch && matchesType && matchesLocation;
      }) || [];

    setFilteredEvents(filtered);
  }, [searchQuery, selectedType, selectedLocation, events.data]);

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toISOString().split("T")[0];
  // };

  const fetchData = async () => {
    dispatch(updateLoading(true));
    try {
      const response = await axiosInstance.get("/events");
      const data = response.data;
      dispatch(
        updateEventSlice({
          status: "success",
          data: data.events,
          loading: false,
        })
      );
    } catch (error: any) {
      dispatch(
        updateEventSlice({
          status: "error",
          data: null,
          loading: false,
        })
      );
      console.error("Error fetching events data:", error);
      toast.error(error.message || "Failed to fetch events data");
    }
  };

  useEffect(() => {
    if (events.data === null) {
      fetchData();
    }
  }, [dispatch]);

  if (events.loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div>
      {!isLoggedIn && <Header />}
      <div className="container mx-auto lg:py-8 lg:px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Startup Events</h1>
        </div>
        <div className="rounded-lg bg-card text-card-foreground mb-6 border border-border/50 shadow-sm">
          <div className="p-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
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
                  className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9 bg-background"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex items-center gap-2">
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
                    className="lucide lucide-calendar h-4 w-4 text-muted-foreground hidden sm:block"
                  >
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-[160px]"
                  >
                    {eventTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type.replace(/\b\w/g, (char) => char.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative flex items-center gap-2">
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
                    className="lucide lucide-map-pin h-4 w-4 text-muted-foreground hidden sm:block"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-[160px]"
                  >
                    {uniqueLocations.map((location, index) => (
                      <option key={index} value={location}>
                        {location.length > 25
                          ? location
                              .replace(/\b\w/g, (char) => char.toUpperCase())
                              .slice(0, 25) + "..."
                          : location.replace(/\b\w/g, (char) =>
                              char.toUpperCase()
                            )}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        {events.status === "error" ? (
          <div className="text-center mt-4 text-red-500">
            Error loading events. Please try again later.
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center mt-4 text-gray-500">
            No events found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover-lift transition-all duration-300 h-full flex flex-col"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={
                      event.banner ||
                      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    }
                    alt={event.title || "Event Banner"}
                    className="max-w-full max-h-full bg-gray-100 mx-auto"
                  />
                </div>
                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.type === "networking"
                          ? "bg-blue-100 text-blue-800"
                          : event.type === "conference"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {(event.type &&
                        event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)) ||
                        "Unknown"}
                    </span>
                    {/* <span className="text-xs text-gray-500">
                      {formatDate(event.created_at || new Date().toISOString())}
                    </span> */}
                  </div>
                  <h3 className="font-semibold tracking-tight text-xl line-clamp-1">
                    {event.title || "Untitled Event"}
                  </h3>
                </div>
                <div className="p-6 pt-0 pb-2 flex-grow">
                  <div className="text-gray-600 text-sm line-clamp-3 mb-4">
                    <RichTextDisplay
                      content={event.description}
                      fallbackText="No description available."
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
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
                        className="lucide lucide-calendar h-4 w-4 mr-2"
                      >
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                      <span>
                        {event.start_date
                          ? new Date(event.start_date)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")
                          : "TBD"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
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
                        className="lucide lucide-map-pin h-4 w-4 mr-2"
                      >
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{event.location_name || "TBD"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-6 pt-2">
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate(`/event/view/${event.id}`);
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDashboard;
