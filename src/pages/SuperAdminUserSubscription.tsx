import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define interfaces for type safety
interface Subscription {
  id: string;
  user: string;
  email: string;
  plan: string;
  status: string;
  startDate: string;
  actions: string[];
}

const UserSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Dummy data for user subscriptions
  const dummySubscriptions: Subscription[] = [
    {
      id: "1",
      user: "John Doe",
      email: "john@example.com",
      plan: "Professional",
      status: "Active",
      startDate: "May 1, 2023",
      actions: ["View", "Edit"],
    },
    {
      id: "2",
      user: "Jane Smith",
      email: "jane@example.com",
      plan: "Enterprise",
      status: "Active",
      startDate: "Jan 15, 2023",
      actions: ["View", "Edit"],
    },
    {
      id: "3",
      user: "Bob Johnson",
      email: "bob@example.com",
      plan: "Basic",
      status: "Expired",
      startDate: "Mar 10, 2023",
      actions: ["View", "Edit"],
    },
  ];

  useEffect(() => {
    setSubscriptions(dummySubscriptions);
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string): string => {
    switch (plan.toLowerCase()) {
      case "basic":
        return "bg-gray-100 text-gray-800";
      case "professional":
        return "bg-blue-100 text-blue-800";
      case "enterprise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === "" || sub.plan === selectedPlan;
    const matchesStatus =
      selectedStatus === "" || sub.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const resetFilters = (): void => {
    setSearchTerm("");
    setSelectedPlan("");
    setSelectedStatus("");
  };

  const addSubscription = (): void => {
    toast.success("Add subscription functionality");
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
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
              className="lucide lucide-users inline mr-2 h-5 w-5"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            User Subscriptions
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage and track user subscriptions
          </p>
        </div>
      </div>
      <div className="p-6 pt-0">
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex-1 max-w-md">
            <input
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full"
              placeholder="Search by user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Plan</span>
              <select
                className="border rounded px-2 py-1 text-xs"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
              >
                <option value="">All Plans</option>
                <option value="Basic">Basic</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Status</span>
              <select
                className="border rounded px-2 py-1 text-xs"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Pending">Pending</option>
              </select>
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
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 mt-3"
              onClick={addSubscription}
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
                className="lucide lucide-plus mr-1 h-3 w-3"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Add Subscription
            </button>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="overflow-x-auto">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                    User
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                    Email
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                    Plan
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                    Start Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[_tr:last-child]:border-0">
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No subscriptions found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((subscription) => (
                    <tr
                      key={subscription.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">{subscription.user}</td>
                      <td className="p-4 align-middle">{subscription.email}</td>
                      <td className="p-4 align-middle">
                        <div
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground ${getPlanColor(
                            subscription.plan
                          )}`}
                        >
                          {subscription.plan}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground ${getStatusColor(
                            subscription.status
                          )}`}
                        >
                          {subscription.status}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {subscription.startDate}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                            View
                          </button>
                          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                            Edit
                          </button>
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
      <div className="items-center flex justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredSubscriptions.length} of {subscriptions.length}{" "}
          subscriptions
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
  );
};

export default UserSubscriptions;
