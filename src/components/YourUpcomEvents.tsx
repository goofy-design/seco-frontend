import { useNavigate } from "react-router-dom";

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

interface YourUpcomEventsProps {
  events: Event[];
}

const YourUpcomEvents = ({ events }: YourUpcomEventsProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="space-y-1.5 p-6 flex flex-row items-center justify-between">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Your Events
        </h3>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          onClick={() => navigate("/my-events")}
        >
          View All
        </button>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {events.length > 0 ? (
            events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-start p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="bg-primary/10 text-primary rounded-md p-3 mr-4 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>
                      {new Date(event.start_date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      •{" "}
                      {new Date(event.start_date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div>{event.location_name || event.location}</div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-primary">{event.type}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No upcoming events found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourUpcomEvents;
