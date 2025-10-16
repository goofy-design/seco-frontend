const Tools = () => {
  return (
    <div>
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Powerful Tools for Startups
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to connect with the right opportunities, build
              relationships, and grow your startup.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="mb-4">
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
                    className="lucide lucide-zap h-10 w-10 text-primary"
                  >
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Smart Matching
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-muted-foreground text-base">
                  Our AI-powered algorithm connects startups with the perfect
                  investors, accelerators, and incubators based on industry,
                  stage, and goals.
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="mb-4">
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
                    className="lucide lucide-globe h-10 w-10 text-primary"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Event Discovery
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-muted-foreground text-base">
                  Find relevant pitch competitions, networking events, and
                  industry conferences tailored to your startup's needs.
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="mb-4">
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
                    className="lucide lucide-users h-10 w-10 text-primary"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Founder Community
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-muted-foreground text-base">
                  Connect with other founders, share experiences, and get advice
                  from those who've walked the path before you.
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="mb-4">
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
                    className="lucide lucide-chart-line h-10 w-10 text-primary"
                  >
                    <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Investor Analytics
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-muted-foreground text-base">
                  Gain insights into investor preferences, portfolio companies,
                  and investment criteria to tailor your pitches.
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="mb-4">
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
                    className="lucide lucide-lock h-10 w-10 text-primary"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Secure Connections
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-muted-foreground text-base">
                  All communications and document sharing happen in a secure
                  environment with privacy controls you manage.
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="mb-4">
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
                    className="lucide lucide-clock h-10 w-10 text-primary"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Time-Saving Tools
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-muted-foreground text-base">
                  Automate follow-ups, schedule meetings, and manage your
                  fundraising pipeline all in one place.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-xl p-8 border shadow-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Your Startup's Growth Journey Starts Here
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of founders who've found the right connections
                  to grow their startups. Our platform offers everything you
                  need to navigate the complex world of fundraising and startup
                  growth.
                </p>
                <div className="mt-8">
                  <div className="flex items-center space-x-2">
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
                      className="lucide lucide-lightbulb h-5 w-5 text-primary"
                    >
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                      <path d="M9 18h6"></path>
                      <path d="M10 22h4"></path>
                    </svg>
                    <span className="text-lg font-medium">
                      Why founders choose Seco Discover
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <ul className="grid grid-cols-1 gap-3">
                  <li className="flex items-start">
                    <div className="mr-3 mt-1">
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
                        className="lucide lucide-check h-5 w-5 text-green-500"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span>Access to 1000+ active investors</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1">
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
                        className="lucide lucide-check h-5 w-5 text-green-500"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span>Personalized startup-investor matching</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1">
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
                        className="lucide lucide-check h-5 w-5 text-green-500"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span>Exclusive industry events and webinars</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1">
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
                        className="lucide lucide-check h-5 w-5 text-green-500"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span>Pitch deck review and feedback</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1">
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
                        className="lucide lucide-check h-5 w-5 text-green-500"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span>Fundraising strategy sessions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1">
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
                        className="lucide lucide-check h-5 w-5 text-green-500"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span>Startup valuation guidance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1">
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
                        className="lucide lucide-check h-5 w-5 text-green-500"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span>Term sheet analysis</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-1">
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
                        className="lucide lucide-check h-5 w-5 text-green-500"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                    <span>Due diligence preparation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tools;
