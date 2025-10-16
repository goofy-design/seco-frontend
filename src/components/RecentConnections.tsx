import { useNavigate } from "react-router-dom";

const RecentConnections = () => {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in"
      style={{ animationDelay: "0.4s" }}
    >
      <div className="space-y-1.5 p-6 flex flex-row items-center justify-between">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Recent Connections
        </h3>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          onClick={() => navigate("/discover")}
        >
          Find More
        </button>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          <div className="flex items-center p-3 rounded-lg hover:bg-secondary transition-colors">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Rohit Sharma"
              className="h-12 w-12 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
              <h4 className="font-medium">Rohit Sharma</h4>
              <div className="text-sm text-muted-foreground">
                Angel Investor at Sharma Ventures
              </div>
              <div className="mt-1 text-xs text-primary">
                Connected 2 days ago
              </div>
            </div>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
          <div className="flex items-center p-3 rounded-lg hover:bg-secondary transition-colors">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Priya Patel"
              className="h-12 w-12 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
              <h4 className="font-medium">Priya Patel</h4>
              <div className="text-sm text-muted-foreground">
                Program Director at TechStars India
              </div>
              <div className="mt-1 text-xs text-primary">
                Connected 4 days ago
              </div>
            </div>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentConnections;
