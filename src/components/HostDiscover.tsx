const HostDiscover = () => {
  return (
    <div>
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Host and discover events that matter
            </h2>
            <p className="text-muted-foreground text-lg">
              From workshops to pitch competitions, find the perfect events to
              grow your network and showcase your startup.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm text-center hover:shadow-md transition-shadow animate-fade-in">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="mx-auto p-3 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="text-primary">
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
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold tracking-tight text-xl">
                  Workshops
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-sm text-muted-foreground">
                  Interactive sessions led by industry experts
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm text-center hover:shadow-md transition-shadow animate-fade-in">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="mx-auto p-3 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="text-primary">
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
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold tracking-tight text-xl">
                  Pitch Events
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-sm text-muted-foreground">
                  Showcase your startup to potential investors
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm text-center hover:shadow-md transition-shadow animate-fade-in">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="mx-auto p-3 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="text-primary">
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
                    >
                      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold tracking-tight text-xl">
                  Hackathons
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-sm text-muted-foreground">
                  Collaborate and build solutions in a competitive environment
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm text-center hover:shadow-md transition-shadow animate-fade-in">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="mx-auto p-3 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="text-primary">
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
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 1 0 7.75"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold tracking-tight text-xl">
                  Networking Mixers
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-sm text-muted-foreground">
                  Connect with founders, investors, and industry leaders
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <a
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
              href="/events"
            >
              Browse All Events
            </a>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Seco Discover works
            </h2>
            <p className="text-muted-foreground text-lg">
              Our platform makes it easy to connect, discover, and grow your
              startup.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative animate-fade-in">
              <div className="text-6xl font-bold text-primary/10 absolute -top-6 left-0">
                01
              </div>
              <div className="pt-8 pl-4">
                <h3 className="text-xl font-semibold mb-2">
                  Create your profile
                </h3>
                <p className="text-muted-foreground">
                  Sign up and build your startup or investor profile with all
                  the relevant details and preferences.
                </p>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="text-6xl font-bold text-primary/10 absolute -top-6 left-0">
                02
              </div>
              <div className="pt-8 pl-4">
                <h3 className="text-xl font-semibold mb-2">
                  Discover opportunities
                </h3>
                <p className="text-muted-foreground">
                  Browse events, accelerator programs, and potential investors
                  that match your specific needs.
                </p>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="text-6xl font-bold text-primary/10 absolute -top-6 left-0">
                03
              </div>
              <div className="pt-8 pl-4">
                <h3 className="text-xl font-semibold mb-2">Connect and grow</h3>
                <p className="text-muted-foreground">
                  Attend events, schedule meetings, and build relationships that
                  help your startup succeed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HostDiscover;
