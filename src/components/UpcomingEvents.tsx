const UpcomingEvents = () => {
  return (
    <div>
      <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground text-lg">
              Join industry leaders and fellow entrepreneurs at our curated
              events designed to help your startup grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Event 1 */}
            <div
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in flex flex-col h-full"
              style={{ animationDelay: "0s" }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1350&amp;q=80"
                  alt="Startup Pitch Competition"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Pitch Event
                </div>
              </div>

              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="font-semibold tracking-tight text-xl line-clamp-1">
                  Startup Pitch Competition
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Present your startup idea to a panel of investors and industry
                  experts for a chance to win funding.
                </p>
              </div>

              <div className="p-6 pt-0 flex-grow space-y-3 pb-4">
                <EventDetails
                  date="May 15, 2023"
                  time="3:00 PM - 6:00 PM"
                  location="Innovation Hub, Bangalore"
                  attendees="120 attendees"
                />
              </div>

              <div className="flex items-center p-6 pt-0">
                <a
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  href="/events/1"
                >
                  View Details
                </a>
              </div>
            </div>

            {/* Event 2 */}
            <div
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in flex flex-col h-full"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="relative h-48 overflow-hidden">
                {/* No image for this one */}
                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Workshop
                </div>
              </div>

              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="font-semibold tracking-tight text-xl line-clamp-1">
                  AI in Healthcare Workshop
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Learn how artificial intelligence is revolutionizing
                  healthcare and how startups can leverage this technology.
                </p>
              </div>

              <div className="p-6 pt-0 flex-grow space-y-3 pb-4">
                <EventDetails
                  date="June 3, 2023"
                  time="10:00 AM - 2:00 PM"
                  location="Tech Park, Mumbai"
                  attendees="75 attendees"
                />
              </div>

              <div className="flex items-center p-6 pt-0">
                <a
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  href="/events/2"
                >
                  View Details
                </a>
              </div>
            </div>

            {/* Event 3 */}
            <div
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in flex flex-col h-full"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1350&amp;q=80"
                  alt="Venture Capital Networking Mixer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Networking
                </div>
              </div>

              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="font-semibold tracking-tight text-xl line-clamp-1">
                  Venture Capital Networking Mixer
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Connect with top venture capitalists and angel investors
                  looking for promising startups to fund.
                </p>
              </div>

              <div className="p-6 pt-0 flex-grow space-y-3 pb-4">
                <EventDetails
                  date="June 10, 2023"
                  time="6:00 PM - 9:00 PM"
                  location="The Grand Hotel, Delhi"
                  attendees="150 attendees"
                />
              </div>

              <div className="flex items-center p-6 pt-0">
                <a
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  href="/events/3"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
              href="/events"
            >
              View All Events
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

// Separate small reusable EventDetails component for less code duplication
const EventDetails = ({ date, time, location, attendees }: any) => {
  return (
    <>
      <div className="flex items-center text-sm text-muted-foreground">
        <CalendarIcon />
        <span>{date}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <ClockIcon />
        <span>{time}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <MapPinIcon />
        <span>{location}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <UsersIcon />
        <span>{attendees}</span>
      </div>
    </>
  );
};

// Icons as reusable SVG components
const CalendarIcon = () => (
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
    className="lucide lucide-calendar mr-2 h-4 w-4 text-primary"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const ClockIcon = () => (
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
    className="lucide lucide-clock mr-2 h-4 w-4 text-primary"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MapPinIcon = () => (
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
    className="lucide lucide-map-pin mr-2 h-4 w-4 text-primary"
  >
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const UsersIcon = () => (
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
    className="lucide lucide-users mr-2 h-4 w-4 text-primary"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default UpcomingEvents;
