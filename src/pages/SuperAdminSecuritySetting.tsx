import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./../reudux/slices/authSlice";
import API_CONSTANTS from "@/utils/apiConstants";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";

export interface ISuperAdminSecuritySetting {
  minimum_password_length: number;
  password_expiry: number;
  failed_login_limit: number;
  session_timeout: number;
}

const SecuritySettings = () => {
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [securitySetting, setSecuritySetting] =
    useState<ISuperAdminSecuritySetting>({
      minimum_password_length: 0,
      password_expiry: 0,
      failed_login_limit: 0,
      session_timeout: 0,
    });

  useEffect(() => {
    const fetchSecuritySetting = async () => {
      if (!user || !user.id) {
        toast.error("No user found!!");
        return;
      }
      setIsLoading(true);
      try {
        const result = await axiosInstance(
          API_CONSTANTS.SECURITY_SETTING_SUPER_ADMIN
        );
        const data = result?.data?.data;
        if (data) {
          setSecuritySetting({
            minimum_password_length: data.minimum_password_length || null,
            password_expiry: data.password_expiry || null,
            failed_login_limit: data.failed_login_limit || null,
            session_timeout: data.session_timeout || null,
          });
        }
      } catch (error) {
        setIsError("Failed to fetch security settings.");
        // toast.error("Failed to fetch security settings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecuritySetting();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    const newValue =
      type === "checkbox" && target instanceof HTMLInputElement
        ? target.checked
        : value;

    setSecuritySetting((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSaveSettings = async () => {
    if (!user || !user.id) {
      toast.error("No user found!!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.patch(
        API_CONSTANTS.UPDATE_SECURITY_SETTING_SUPER_ADMIN,
        securitySetting
      );
      if (response.status === 200) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch (error) {
      setIsError("Failed to update security settings.");
      toast.error("Failed to update security settings.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="mt-16 pt-4">
          <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="mt-16 pt-4">
          <div className="container mx-auto py-8 px-4">
            <div className="text-center text-red-500">
              {isError || "Event not found"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
            className="lucide lucide-shield-check h-5 w-5"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          Security Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure security and privacy options
        </p>
      </div>
      <div className="p-6 pt-0 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              htmlFor="minimum_password_length"
            >
              Minimum Password Length
            </label>
            <input
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              id="minimum_password_length"
              name="minimum_password_length"
              min="6"
              max="32"
              value={securitySetting.minimum_password_length}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Minimum characters required for passwords
            </p>
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              htmlFor="password_expiry"
            >
              Password Expiry (days)
            </label>
            <input
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              id="password_expiry"
              name="password_expiry"
              min="0"
              value={securitySetting.password_expiry}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Days before users are required to reset passwords (0 = never)
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              htmlFor="failed_login_limit"
            >
              Failed Login Limit
            </label>
            <input
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              id="failed_login_limit"
              name="failed_login_limit"
              min="1"
              max="10"
              value={securitySetting.failed_login_limit}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Number of failed attempts before account is locked
            </p>
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              htmlFor="session_timeout"
            >
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              id="session_timeout"
              name="session_timeout"
              min="5"
              value={securitySetting.session_timeout}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Idle time before user is automatically logged out
            </p>
          </div>
        </div>
        {/* <div className="rounded-md border p-4 space-y-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
            Security Requirements
          </label>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="two_fa_for_admin_users"
                name="two_fa_for_admin_users"
                checked={securitySetting.two_fa_for_admin_users}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="two_fa_for_admin_users"
              >
                Require 2FA for Admin Users
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ip_whitelist"
                name="ip_whitelist"
                checked={securitySetting.ip_whitelist}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="ip_whitelist"
              >
                IP Whitelist
              </label>
            </div>
          </div>
        </div> */}
      </div>

      <div className="items-center flex justify-between border-t p-4">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          onClick={() => {
            setSecuritySetting({
              minimum_password_length: 0,
              password_expiry: 0,
              failed_login_limit: 0,
              session_timeout: 0,
            });
            toast.success("Settings reset to default!");
          }}
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
            className="lucide lucide-refresh-cw mr-2 h-4 w-4"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M8 16H3v5"></path>
          </svg>
          Reset to Default
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          onClick={handleSaveSettings}
          disabled={isLoading}
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
            className="lucide lucide-save mr-2 h-4 w-4"
          >
            <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
            <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
            <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
          </svg>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
