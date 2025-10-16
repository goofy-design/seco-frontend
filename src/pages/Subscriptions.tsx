const Subscriptions = () => {
  return (
    <div>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">My Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
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
                className="lucide lucide-ticket h-5 w-5"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                <path d="M13 5v2"></path>
                <path d="M13 17v2"></path>
                <path d="M13 11v2"></path>
              </svg>
              Current Subscription
            </h3>
            <p className="text-sm text-muted-foreground">
              Details about your current subscription plan
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status</p>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                    active
                  </div>
                </div>
                <div>
                  <p className="font-medium">Plan</p>
                  <p>Basic</p>
                </div>
                <div>
                  <p className="font-medium">Price</p>
                  <p>$9.99/monthly</p>
                </div>
                <div>
                  <p className="font-medium">Next billing date</p>
                  <p>2025-06-15</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Payment Method
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded-md p-2">
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
                      className="lucide lucide-credit-card h-5 w-5"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                      <line x1="2" x2="22" y1="10" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">
                      Expires 12/26
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="items-center p-6 pt-0 border-t bg-muted/50 flex justify-between">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Cancel Subscription
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Manage Payment Details
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-card text-card-foreground border-blue-500 shadow-md flex flex-col">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Basic
                  </h3>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground hover:bg-primary/80 bg-blue-500">
                    Current Plan
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$9.99</span>
                    <span className="ml-1 text-gray-500">/monthly</span>
                  </div>
                </p>
              </div>
              <div className="p-6 pt-0 flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Access to basic modules</span>
                  </li>
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Limited storage (5GB)</span>
                  </li>
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Email support</span>
                  </li>
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Single user</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center p-6 pt-0 border-t bg-muted/50">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                  Current Plan
                </button>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Professional
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$29.99</span>
                    <span className="ml-1 text-gray-500">/monthly</span>
                  </div>
                </p>
              </div>
              <div className="p-6 pt-0 flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Access to all basic modules plus analytics</span>
                  </li>
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Increased storage (20GB)</span>
                  </li>
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Up to 5 team members</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center p-6 pt-0 border-t bg-muted/50">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                  Select Plan
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
                    className="lucide lucide-arrow-right ml-2 h-4 w-4"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Enterprise
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$99.99</span>
                    <span className="ml-1 text-gray-500">/monthly</span>
                  </div>
                </p>
              </div>
              <div className="p-6 pt-0 flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Access to all modules</span>
                  </li>
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Unlimited storage</span>
                  </li>
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>24/7 phone and email support</span>
                  </li>
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-start">
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
                      className="lucide lucide-check h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Custom integrations</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center p-6 pt-0 border-t bg-muted/50">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                  Select Plan
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
                    className="lucide lucide-arrow-right ml-2 h-4 w-4"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            <div>
              <h3 className="font-medium">How do I change my plan?</h3>
              <p className="text-muted-foreground">
                You can upgrade or downgrade your plan at any time. Simply
                select the new plan above.
              </p>
            </div>
            <div>
              <h3 className="font-medium">When will I be charged?</h3>
              <p className="text-muted-foreground">
                Your subscription is renewed automatically at the end of each
                billing period.
              </p>
            </div>
            <div>
              <h3 className="font-medium">How do I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                You can cancel your subscription at any time using the "Cancel
                Subscription" button above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;