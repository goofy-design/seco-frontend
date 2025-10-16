import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import API_CONSTANTS from "../utils/apiConstants";
import Suspence from "@/components/Suspence";
import { EventInterface } from "@/types/event";
import RichTextDisplay from "@/components/RichTextDisplay";

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        // Fetch events created by the user
        const response = await axiosInstance.get(
          API_CONSTANTS.GET_EVENTS_BY_USER
        );

        // Ensure the response data is an array
        const eventsData = Array.isArray(response.data)
          ? response.data
          : response.data?.data
          ? response.data.data
          : response.data?.events
          ? response.data.events
          : [];

        setEvents(eventsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      setDeleteSuccess(null);

      // First, delete all form fields associated with this event
      await axiosInstance.delete(API_CONSTANTS.DELETE_FORM_BY_EVENT(eventId), {
        params: {
          event_id: eventId,
        },
      });

      // Then delete the event
      await axiosInstance.delete(API_CONSTANTS.DELETE_EVENT(eventId));
      // Remove the deleted event from the state
      setEvents(events.filter((event) => event.id !== eventId));

      // Show success message
      setDeleteSuccess("Event deleted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspence isLoading={loading} isError={!!error}>
      <div className="p-6">
        <div className="container mx-auto !pl-0 !pr-0 lg:py-8 lg:px-4">
          {/* Success Alert */}
          {deleteSuccess && (
            <div
              className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{deleteSuccess}</span>
              <button
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setDeleteSuccess(null)}
              >
                <svg
                  className="fill-current h-6 w-6 text-green-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
              <button
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
              >
                <svg
                  className="fill-current h-6 w-6 text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">My Events</h1>
            <button
              onClick={() => navigate("/event")}
              className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex items-center"
            >
              <span>Create New Event</span>
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
                className="lucide lucide-external-link ml-2 h-4 w-4"
              >
                <path d="M15 3h6v6"></path>
                <path d="M10 14 21 3"></path>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              </svg>
            </button>
          </div>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                You haven't created any events yet.
              </p>
              <button
                onClick={() => navigate("/event")}
                className="text-primary hover:underline"
              >
                Create your first event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
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
                      className="w-full h-full object-cover bg-gray-100"
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
                        {event.type || "Unknown"}
                      </span>
                      <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex items-center gap-1">
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
                          className="lucide lucide-users h-3 w-3"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        0{/* {event.attendees ? event.attendees : 0} */}
                      </div>
                    </div>
                    <h3 className="font-semibold tracking-tight text-xl line-clamp-1">
                      {event.title ? event.title : "No title"}
                    </h3>
                  </div>
                  <div className="p-6 pt-0 pb-2 flex-grow">
                    <div className="text-gray-600 text-sm line-clamp-3 mb-4">
                      <RichTextDisplay
                        content={event.description}
                        fallbackText="No description"
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
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="4"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="16" x2="16" y1="2" y2="6"></line>
                          <line x1="8" x2="8" y1="2" y2="6"></line>
                          <line x1="3" x2="21" y1="10" y2="10"></line>
                        </svg>
                        <span>
                          {event.start_date
                            ? new Date(event.start_date).toLocaleDateString()
                            : "No date"}
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
                        <span>
                          {event.location_name
                            ? event.location_name
                            : "No location"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="items-center p-6 flex flex-col space-y-2 pt-2">
                    {/* <div className="flex space-x-2 w-full">
                      <button
                        className="gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1 flex items-center justify-center"
                        onClick={() => navigate(`/event/${event.id}`)}
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
                          className="lucide lucide-square-pen h-4 w-4 mr-2"
                        >
                          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        className="gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background h-10 px-4 py-2 flex-1 flex items-center justify-center text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        onClick={() => handleDeleteEvent(event.id || "")}
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
                          className="lucide lucide-trash-2 h-4 w-4 mr-2"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          <line x1="10" x2="10" y1="11" y2="17"></line>
                          <line x1="14" x2="14" y1="11" y2="17"></line>
                        </svg>
                        Delete
                      </button>
                    </div> */}
                    <button
                      className="w-full gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex items-center justify-center"
                      onClick={() => navigate(`/event/manage/${event.id}`)}
                    >
                      Manage
                    </button>
                    <button
                      className="w-full gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-red-50 hover:bg-red-600 h-10 px-4 py-2 flex items-center justify-center"
                      onClick={() => {
                        confirm(
                          "Are you sure you want to delete this event? You cannot undo this action."
                        ) && handleDeleteEvent(event.id || "");
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Suspence>
  );
};

export default MyEvents;
