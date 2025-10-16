import { useEffect, useState } from "react";
import { toast } from "sonner";
import AccessModules from "./SuperAdminAccessModule";
import UserSubscriptions from "./SuperAdminUserSubscription";
import axiosInstance from "./../utils/axios";
import API_CONSTANTS from "./../utils/apiConstants";

const SuperAdminSubscriptionManagement = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("plans");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalRef] = useState<React.RefObject<HTMLDivElement> | null>(
    null
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  interface PlanFormData {
    name: string;
    price: string;
    billing: string;
    features: string[];
    modules: string[];
  }

  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    price: "",
    billing: "monthly",
    features: [""],
    modules: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  // Available modules for selection
  const availableModules = [
    { id: "Dashboard", name: "Dashboard" },
    { id: "Applications", name: "Applications" },
    { id: "Explore", name: "Explore" },
    { id: "Vault", name: "Vault" },
    { id: "Analytics", name: "Analytics" },
    { id: "SuperAdmin", name: "SuperAdmin" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          API_CONSTANTS.GET_SUBSCRIPTION_PLAN_SUPER_ADMIN
        );
        setPlans(response?.data?.data);
      } catch (error) {
        setError("Failed to fetch plan data");
        toast.error("Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      billing: "monthly",
      features: [""],
      modules: [],
    });
    setEditingPlan(null);
  };

  // Open modal for creating new plan
  const createNewPlan = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing plan
  interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    billing: string;
    features: string[];
    modules: string[];
    isPopular?: boolean;
  }

  interface PlanFormData {
    name: string;
    price: string;
    billing: string;
    features: string[];
    modules: string[];
  }

  const editPlan = (plan: SubscriptionPlan) => {
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      billing: plan.billing,
      features: [...plan.features],
      modules: [...plan.modules],
    });
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Handle form input changes
  interface InputChangeEvent
    extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> {}

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev: PlanFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle feature changes
  interface HandleFeatureChange {
    (index: number, value: string): void;
  }

  const handleFeatureChange: HandleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev: PlanFormData) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  // Add new feature
  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  // Remove feature
  interface RemoveFeature {
    (index: number): void;
  }

  const removeFeature: RemoveFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData((prev: PlanFormData) => ({
        ...prev,
        features: newFeatures,
      }));
    }
  };

  // Handle module selection
  interface HandleModuleChange {
    (moduleId: string): void;
  }

  const handleModuleChange: HandleModuleChange = (moduleId) => {
    setFormData((prev: PlanFormData) => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter((m: string) => m !== moduleId)
        : [...prev.modules, moduleId],
    }));
  };

  // Handle form submission
  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  interface PlanData {
    name: string;
    price: number;
    billing: string;
    features: string[];
    modules: string[];
  }

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    e.preventDefault();

    // Validation
    if (
      !formData.name.trim() ||
      !formData.price ||
      formData.features.some((f: string) => !f.trim()) ||
      formData.modules.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const planData: PlanData = {
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.filter((f: string) => f.trim()),
      };

      if (editingPlan) {
        await axiosInstance.patch(
          API_CONSTANTS.EDIT_SUBSCRIPTION_PLAN_SUPER_ADMIN(editingPlan?.id),
          planData
        );
      } else {
        await axiosInstance.post(
          API_CONSTANTS.CREATE_SUBSCRIPTION_PLAN_SUPER_ADMIN,
          planData
        );
      }

      // Refetch plans to update local state
      const plansResponse = await axiosInstance.get(
        API_CONSTANTS.GET_SUBSCRIPTION_PLAN_SUPER_ADMIN
      );
      setPlans(plansResponse?.data?.data);

      toast.success(
        editingPlan
          ? "Plan updated successfully!"
          : "Plan created successfully!"
      );
      closeModal();
    } catch (error) {
      toast.error(
        editingPlan ? "Failed to update plan" : "Failed to create plan"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlanId) return;
    setDeleteLoadingId(selectedPlanId);
    try {
      await axiosInstance.delete(
        API_CONSTANTS.DELETE_SUBSCRIPTION_PLAN_SUPER_ADMIN(selectedPlanId)
      );
      const plansResponse = await axiosInstance.get(
        API_CONSTANTS.GET_SUBSCRIPTION_PLAN_SUPER_ADMIN
      );
      setPlans(plansResponse?.data?.data);
      toast.success("Plan deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete plan");
    } finally {
      setDeleteLoadingId(null);
      setShowDeleteModal(false);
      setSelectedPlanId(null);
    }
  };

  // Handle modal backdrop click
  interface BackdropClickEvent
    extends React.MouseEvent<HTMLDivElement, MouseEvent> {}

  const handleBackdropClick = (e: BackdropClickEvent): void => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg font-semibold">
            Loading subscription management...
          </div>
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

  return (
    <div>
      <div className="container py-6 md:py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/super-admin">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10">
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
                    className="lucide lucide-arrow-left h-4 w-4"
                  >
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                  </svg>
                </button>
              </a>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Subscription Management
                </h1>
                <p className="text-muted-foreground">
                  Manage subscription plans and access control
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-100 text-red-800">
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
                  className="lucide lucide-shield w-3 h-3 mr-1"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>
                SuperAdmin
              </div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                Admin User
              </div>
            </div>
          </div>

          {/* Main Content */}
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
                  aria-selected={activeTab === "plans"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "plans"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("plans")}
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
                    className="lucide lucide-credit-card mr-2 h-4 w-4"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                    <line x1="2" x2="22" y1="10" y2="10"></line>
                  </svg>
                  Subscription Plans
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "modules"}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "modules"
                      ? "bg-background text-foreground shadow-sm"
                      : ""
                  }`}
                  onClick={() => setActiveTab("modules")}
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
                    className="lucide lucide-settings mr-2 h-4 w-4"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Access Modules
                </button>
              </div>
            </div>

            {/* Subscription Plans Tab */}
            {activeTab === "plans" && (
              <div className="space-y-6">
                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.length > 0 &&
                    plans.map((plan) => (
                      <div
                        key={plan?.id}
                        className="rounded-lg border bg-card text-card-foreground shadow-sm relative"
                      >
                        {/* {plan.isPopular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-purple-100 text-purple-800">
                            Popular
                          </div>
                        </div>
                      )} */}
                        <div className="flex flex-col space-y-1.5 p-6">
                          <h3 className="text-2xl font-semibold leading-none tracking-tight">
                            {plan?.name}
                          </h3>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">
                              ${plan?.price}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              /{plan?.billing}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 pt-0">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Features:</h4>
                              <ul className="space-y-1">
                                {plan.features.map((feature, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2 text-sm"
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
                                      className="lucide lucide-check text-green-600"
                                    >
                                      <path d="M20 6 9 17l-5-5"></path>
                                    </svg>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">
                                Included Modules:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {plan?.modules &&
                                  plan?.modules.map((module, index) => (
                                    <div
                                      key={index}
                                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 text-blue-800"
                                    >
                                      {module}
                                    </div>
                                  ))}
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 flex-1"
                                onClick={() => editPlan(plan)}
                              >
                                Edit Plan
                              </button>
                              <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 flex-1"
                                onClick={() => {
                                  setShowDeleteModal(true);
                                  setSelectedPlanId(plan.id);
                                }}
                                disabled={deleteLoadingId === plan.id}
                              >
                                {/* {deleteLoadingId === plan.id ? "Deleting..." : "Delete Plan"} */}
                                Delete Plan
                              </button>
                              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 flex-1">
                                Subscribe Users
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex justify-center">
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    onClick={createNewPlan}
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
                      className="lucide lucide-plus mr-2 h-4 w-4"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                    Create New Plan
                  </button>
                </div>

                <UserSubscriptions />
              </div>
            )}

            {/* Access Modules Tab */}
            {activeTab === "modules" && <AccessModules />}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {editingPlan
                    ? "Edit Subscription Plan"
                    : "Create New Subscription Plan"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
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
                    className="w-6 h-6"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Define a {editingPlan ? "updated" : "new"} subscription plan
                with features and module access.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Plan Name and Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Premium"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="1999"
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Cycle */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Billing Cycle
                  </label>
                  <select
                    name="billing"
                    value={formData.billing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      Features *
                    </label>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) =>
                            handleFeatureChange(index, e.target.value)
                          }
                          placeholder="Enter feature description"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-600 hover:text-red-800 p-1"
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
                              <path d="M18 6 6 18"></path>
                              <path d="M6 6l12 12"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Included Modules */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Included Modules *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableModules.map((module) => (
                      <label
                        key={module.id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.modules.includes(module.id)}
                          onChange={() => handleModuleChange(module.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm">{module.name}</span>
                      </label>
                    ))}
                  </div>
                  {formData.modules.length === 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      Please select at least one module
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingPlan
                      ? "Update Plan"
                      : "Create Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
          >
            <div className="mb-4 text-lg font-semibold">
              Are you sure you want to delete this subscription plan?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPlanId(null);
                }}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                {deleteLoadingId ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSubscriptionManagement;
