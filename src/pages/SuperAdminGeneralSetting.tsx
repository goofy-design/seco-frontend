import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./../reudux/slices/authSlice";
import API_CONSTANTS from "@/utils/apiConstants";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";

export interface ISuperAdminGeneralSetting {
  site_name: string;
  site_description: string;
  contact_email: string;
  support_email: string;
  max_upload_limit: number;
  default_user_role: string;
  maintenance_mode: boolean;
  allow_registration: boolean;
}

const GeneralSettings = () => {
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [generalSetting, setGeneralSetting] =
    useState<ISuperAdminGeneralSetting>({
      site_name: "",
      site_description: "",
      contact_email: "",
      support_email: "",
      max_upload_limit: 0,
      default_user_role: "user",
      maintenance_mode: false,
      allow_registration: false,
    });

  useEffect(() => {
    const fetchGeneralSetting = async () => {
      if (!user || !user.id) {
        toast.error("No user found!!");
        return;
      }
      setIsLoading(true);
      try {
        const result = await axiosInstance(
          API_CONSTANTS.GENERAL_SETTING_SUPER_ADMIN(user?.id)
        );
        const data = result?.data?.data;
        if (data) {
          setGeneralSetting({
            site_name: data.site_name || "",
            site_description: data.site_description || "",
            contact_email: data.contact_email || "",
            support_email: data.support_email || "",
            max_upload_limit: data.max_upload_limit || 0,
            default_user_role: data.default_user_role || "",
            maintenance_mode: data.maintenance_mode || false,
            allow_registration: data.allow_registration || false,
          });
        }
      } catch (error) {
        setIsError("Failed to fetch general settings.");
        // toast.error("Failed to fetch general settings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeneralSetting();
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

    setGeneralSetting((prev) => ({
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
        API_CONSTANTS.UPDATE_GENERAL_SETTING_SUPER_ADMIN(user?.id),
        generalSetting
      );
      if (response.status === 200) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch (error) {
      setIsError("Failed to update general settings.");
      toast.error("Failed to update general settings.");
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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
      <div className="flex flex-col space-y-1.5 py-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
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
            className="lucide lucide-globe h-5 w-5"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
            <path d="M2 12h20"></path>
          </svg>
          General Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Basic configuration for the platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="site_name"
          >
            Site Name
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            id="site_name"
            name="site_name"
            value={generalSetting.site_name}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            The name of your platform as it appears to users
          </p>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="site_description"
          >
            Site Description
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            id="site_description"
            name="site_description"
            value={generalSetting.site_description}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            A brief description of your platform
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="contact_email"
          >
            Contact Email
          </label>
          <input
            type="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            id="contact_email"
            name="contact_email"
            value={generalSetting.contact_email}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            Main contact email for the platform
          </p>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="support_email"
          >
            Support Email
          </label>
          <input
            type="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            id="support_email"
            name="support_email"
            value={generalSetting.support_email}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            Email where users can get support
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="max_upload_limit"
          >
            Maximum Upload Size (MB)
          </label>
          <input
            type="number"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            id="max_upload_limit"
            name="max_upload_limit"
            value={generalSetting.max_upload_limit}
            onChange={handleInputChange}
          />
          <p className="text-xs text-muted-foreground">
            Maximum file size users can upload
          </p>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="default_user_role"
          >
            Default User Role
          </label>
          <select
            id="default_user_role"
            name="default_user_role"
            className="w-full border rounded p-2"
            value={generalSetting.default_user_role}
            onChange={handleInputChange}
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
            <option value="judge">Judge</option>
            <option value="organizer">Organizer</option>
            <option value="founder">Founder</option>
            <option value="reviewer">Reviewer</option>
            <option value="investor">Investor</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Role assigned to new users upon registration
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 my-8">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2"
            htmlFor="maintenance_mode"
          >
            Maintenance Mode
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="maintenance_mode"
              name="maintenance_mode"
              checked={generalSetting.maintenance_mode}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="maintenance_mode"
            >
              Enable Maintenance Mode
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            When enabled, only superadmins can access the site
          </p>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2"
            htmlFor="allow_registration"
          >
            Allow Registration
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allow_registration"
              name="allow_registration"
              checked={generalSetting.allow_registration}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="allow_registration"
            >
              Allow New Users to Register
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            When disabled, new users cannot create accounts
          </p>
        </div>
      </div>

      <div className="items-center flex justify-between border-t py-4">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          onClick={() => {
            setGeneralSetting({
              site_name: "",
              site_description: "",
              contact_email: "",
              support_email: "",
              max_upload_limit: 0,
              default_user_role: "",
              maintenance_mode: false,
              allow_registration: false,
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

export default GeneralSettings;
