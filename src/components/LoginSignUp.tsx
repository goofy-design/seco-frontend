import { useEffect, useState } from "react";
import Logo from "../assets/seco logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  signup,
  logoutAsync,
  selectUser,
  selectIsLoggedIn,
  selectLoading,
  selectError,
  clearError,
} from "./../reudux/slices/authSlice";
import { toast } from "sonner";
import API_CONSTANTS from "@/utils/apiConstants";
import axiosInstance from "@/utils/axios";
// Validation errors interface
interface ValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

const LoginSignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [securitySettings, setSecuritySettings] = useState({
    minPasswordLength: 0,
    passwordExpiry: 0,
    failedLoginLimit: 0,
    sessionTimeout: 0,
    google_login_enabled: true,
    linkedin_login_enabled: false,
  });

  const fetchSecuritySettings = async () => {
    try {
      const response = await axiosInstance.get("/super-admin/security-setting");
      if (response.status === 200) {
        const data = response.data.data;
        setSecuritySettings({
          minPasswordLength: data.minimum_password_length || 0,
          passwordExpiry: data.password_expiry || 0,
          failedLoginLimit: data.failed_login_limit || 0,
          sessionTimeout: data.session_timeout || 0,
          google_login_enabled: data?.googleLoginEnabled || true,
          linkedin_login_enabled: data?.linkedinLoginEnabled || false,
        });
      }
      const r1 = await axiosInstance.get("/super-admin/integration-settings");
      const data = r1.data.data;
      setSecuritySettings((prev) => ({
        ...prev,
        google_login_enabled: data?.googleLoginEnabled || false,
        linkedin_login_enabled: data?.linkedinLoginEnabled || false,
      }));
    } catch (error) {
      console.error("Error fetching security settings:", error);
    }
  };

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleTabChange = (tab: "login" | "signup") => {
    setActiveTab(tab);
    dispatch(clearError());
    // Clear validation errors when switching tabs
    setValidationErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation function
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (activeTab === "signup") {
      // Full Name validation for signup
      if (!formData.fullName.trim()) {
        errors.fullName = "Full name is required";
      }
    }

    // Email validation for both login and signup
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation for both login and signup
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (
      activeTab === "signup" &&
      formData.password.length < securitySettings.minPasswordLength
    ) {
      errors.password = `Password must be at least ${securitySettings.minPasswordLength} characters long`;
    } else if (activeTab === "signup" && !/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (activeTab === "signup" && !/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
    } else if (
      activeTab === "signup" &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    ) {
      errors.password = "Password must contain at least one special character";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOAuthLoginTest = async (provider: "google" | "linkedin") => {
    if (!securitySettings[`${provider}_login_enabled`]) {
      toast.error(
        `${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        } login is not enabled.`
      );
      return;
    }
    try {
      const endpointMap: Record<
        "google" | "linkedin",
        keyof typeof API_CONSTANTS
      > = {
        google: "GOOGLE_OAUTH",
        linkedin: "LINKEDIN_OAUTH",
      };

      const endpoint = endpointMap[provider];
      const apiEndpoint = API_CONSTANTS[endpoint] as string;

      window.location.assign(apiEndpoint);
    } catch (error: any) {
      console.error("OAuth authentication error:", error);
      toast.error(
        error.message || "OAuth authentication failed. Please try again."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (activeTab === "login") {
      dispatch(
        login({
          email: formData.email,
          password: formData.password,
        }) as any
      ).then((result: any) => {
        if (result.meta.requestStatus === "fulfilled") {
          navigate("/events");
        }
      });
    } else {
      dispatch(
        signup({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.userType,
        }) as any
      ).then((result: any) => {
        if (result.meta.requestStatus === "fulfilled") {
          navigate("/events");
        }
      });
    }
  };

  const handleLogout = async () => {
    dispatch(logoutAsync() as any).then((result: any) => {
      if (
        result.meta.requestStatus === "fulfilled" ||
        result.meta.requestStatus === "rejected"
      ) {
        navigate("/"); // Redirect regardless of success/failure since state is cleared
      }
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserTypeSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      userType: value,
    }));
    setIsDropdownOpen(false);
  };

  // Helper function to get input classes with error styling
  const getInputClasses = (fieldName: keyof ValidationErrors) => {
    const baseClasses =
      "flex h-10 w-full rounded-md border px-3 py-2 text-base bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:text-sm";
    const errorClasses = "border-red-500 focus-visible:ring-red-500";
    const normalClasses = "focus-visible:ring-ring";

    return `${baseClasses} ${
      validationErrors[fieldName] ? errorClasses : normalClasses
    }`;
  };

  return (
    <div className="container mx-auto py-24 px-4 flex items-center justify-center min-h-screen">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md">
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <h3 className="tracking-tight text-2xl font-bold text-gradient self-center">
            <img src={Logo} alt="logo" width={32} className="w-20" />
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeTab === "login"
              ? "Sign in to your account to continue"
              : "Create an account to get started"}
          </p>
        </div>

        <div className="p-6 pt-0">
          {isLoggedIn ? (
            <div className="text-center">
              <p className="mb-4">You are already logged in as {user?.email}</p>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mb-3"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                {loading ? "Loading..." : "Back to Home Page"}
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <div dir="ltr" data-orientation="horizontal">
              <div
                role="tablist"
                aria-orientation="horizontal"
                className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-2 mb-6"
                tabIndex={0}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "login"}
                  aria-controls="tab-content-login"
                  data-state={activeTab === "login" ? "active" : "inactive"}
                  id="tab-trigger-login"
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "login"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => handleTabChange("login")}
                  tabIndex={activeTab === "login" ? 0 : -1}
                >
                  Login
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "signup"}
                  aria-controls="tab-content-signup"
                  data-state={activeTab === "signup" ? "active" : "inactive"}
                  id="tab-trigger-signup"
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === "signup"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => handleTabChange("signup")}
                  tabIndex={activeTab === "signup" ? 0 : -1}
                >
                  Sign Up
                </button>
              </div>

              <div
                data-state={activeTab === "login" ? "active" : "inactive"}
                role="tabpanel"
                aria-labelledby="tab-trigger-login"
                id="tab-content-login"
                tabIndex={0}
                className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                hidden={activeTab !== "login"}
              >
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="login-email"
                    >
                      Email
                    </label>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={getInputClasses("email")}
                      value={formData.email}
                      onChange={handleInputChange}
                      aria-invalid={!!validationErrors.email}
                      disabled={loading}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="login-password"
                    >
                      Password
                    </label>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className={getInputClasses("password")}
                      value={formData.password}
                      onChange={handleInputChange}
                      aria-invalid={!!validationErrors.password}
                      disabled={loading}
                    />
                    {validationErrors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleOAuthLoginTest("google")}
                      className="inline-flex items-center justify-center gap-2 w-full h-10 px-4 py-2 text-sm font-medium rounded-md bg-white border hover:bg-gray-100 text-black"
                      disabled={loading}
                    >
                      <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google logo"
                        className="w-5 h-5"
                      />
                      Sign in with Google
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOAuthLoginTest("linkedin")}
                      className="inline-flex items-center justify-center gap-2 w-full h-10 px-4 py-2 text-sm font-medium rounded-md bg-[#0077B5] text-white hover:bg-[#0077B5]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      disabled={loading}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      Sign in with LinkedIn
                    </button>
                  </div>
                </form>
              </div>

              <div
                data-state={activeTab === "signup" ? "active" : "inactive"}
                role="tabpanel"
                aria-labelledby="tab-trigger-signup"
                id="tab-content-signup"
                tabIndex={0}
                className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                hidden={activeTab !== "signup"}
              >
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="signup-fullname"
                    >
                      Full Name
                    </label>
                    <input
                      id="signup-fullname"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      className={getInputClasses("fullName")}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      aria-invalid={!!validationErrors.fullName}
                      disabled={loading}
                    />
                    {validationErrors.fullName && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="signup-email"
                    >
                      Email
                    </label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={getInputClasses("email")}
                      value={formData.email}
                      onChange={handleInputChange}
                      aria-invalid={!!validationErrors.email}
                      disabled={loading}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="signup-password"
                    >
                      Password
                    </label>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className={getInputClasses("password")}
                      value={formData.password}
                      onChange={handleInputChange}
                      aria-invalid={!!validationErrors.password}
                      disabled={loading}
                    />
                    {validationErrors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 relative">
                    <label
                      className="text-sm font-medium"
                      htmlFor="signup-usertype"
                    >
                      I am a
                    </label>
                    <button
                      type="button"
                      role="combobox"
                      aria-controls="user-type-dropdown"
                      aria-expanded={isDropdownOpen}
                      aria-autocomplete="none"
                      dir="ltr"
                      data-state={isDropdownOpen ? "open" : "closed"}
                      data-placeholder=""
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                      onClick={toggleDropdown}
                      disabled={loading}
                    >
                      <span className="pointer-events-none">
                        {formData.userType || "Select user type"}
                      </span>
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
                        className={`lucide lucide-chevron-down h-4 w-4 opacity-50 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute z-50 mt-1 bg-popover text-popover-foreground rounded-md border shadow-md bg-white w-full">
                        <div className="p-1">
                          <button
                            type="button"
                            className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleUserTypeSelect("Startup")}
                          >
                            Startup
                          </button>
                          <button
                            type="button"
                            className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() =>
                              handleUserTypeSelect("Individual Founder")
                            }
                          >
                            Individual Founder
                          </button>
                          <button
                            type="button"
                            className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleUserTypeSelect("Investor")}
                          >
                            Investor
                          </button>
                          <button
                            type="button"
                            className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleUserTypeSelect("Incubator")}
                          >
                            Incubator
                          </button>
                          <button
                            type="button"
                            className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleUserTypeSelect("Accelerator")}
                          >
                            Accelerator
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 w-full h-10 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="items-center p-6 pt-0 flex flex-col text-center text-xs text-muted-foreground">
          <p className="text-sm">
            If you're having trouble accessing pages, please log out and sign in
            again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
