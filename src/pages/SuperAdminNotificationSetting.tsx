import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./../reudux/slices/authSlice";
import API_CONSTANTS from "@/utils/apiConstants";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";

export interface INotificationSetting {
  system_email_notifications: boolean;
  admin_alerts: boolean;
  security_alerts: boolean;
  weekly_reports: boolean;
  marketing_emails: boolean;
  new_user_registration: boolean;
  new_applications: boolean;
  new_event_creation: boolean;
  user_feedback: boolean;
}

const NotificationSettings = () => {
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [notificationSetting, setNotificationSetting] =
    useState<INotificationSetting>({
      system_email_notifications: false,
      admin_alerts: false,
      security_alerts: false,
      weekly_reports: false,
      marketing_emails: false,
      new_user_registration: false,
      new_applications: false,
      new_event_creation: false,
      user_feedback: false,
    });

  useEffect(() => {
    const fetchNotificationSetting = async () => {
      if (!user || !user.id) {
        toast.error("No user found!!");
        return;
      }
      setIsLoading(true);
      try {
        const result = await axiosInstance(
          API_CONSTANTS.NOTIFICATION_SETTING_SUPER_ADMIN(user?.id)
        );
        const data = result?.data?.data;
        if (data) {
          setNotificationSetting({
            system_email_notifications:
              data.system_email_notifications || false,
            admin_alerts: data.admin_alerts || false,
            security_alerts: data.security_alerts || false,
            weekly_reports: data.weekly_reports || false,
            marketing_emails: data.marketing_emails || false,
            new_user_registration: data.new_user_registration || false,
            new_applications: data.new_applications || false,
            new_event_creation: data.new_event_creation || false,
            user_feedback: data.user_feedback || false,
          });
        }
      } catch (error) {
        setIsError("Failed to fetch notification settings.");
        // toast.error("Failed to fetch notification settings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationSetting();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSetting((prev) => ({
      ...prev,
      [name]: checked,
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
        API_CONSTANTS.UPDATE_NOTIFICATION_SETTING_SUPER_ADMIN(user?.id),
        notificationSetting
      );
      if (response.status === 200) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch (error) {
      setIsError("Failed to update notification settings.");
      toast.error("Failed to update notification settings.");
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
            className="lucide lucide-bell h-5 w-5"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          Notification Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure system notifications and alerts
        </p>
      </div>

      <div className="p-6 pt-0 space-y-6">
        <div className="rounded-md border p-4 space-y-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
            Email Notifications
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium"
                  htmlFor="system_email_notifications"
                >
                  System Email Notifications
                </label>
                <p className="text-xs text-muted-foreground">
                  Send important system notifications via email
                </p>
              </div>
              <input
                type="checkbox"
                id="system_email_notifications"
                name="system_email_notifications"
                checked={notificationSetting.system_email_notifications}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium"
                  htmlFor="admin_alerts"
                >
                  Admin Alerts
                </label>
                <p className="text-xs text-muted-foreground">
                  Send alerts to admins for important events
                </p>
              </div>
              <input
                type="checkbox"
                id="admin_alerts"
                name="admin_alerts"
                checked={notificationSetting.admin_alerts}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium"
                  htmlFor="security_alerts"
                >
                  Security Alerts
                </label>
                <p className="text-xs text-muted-foreground">
                  Notifications for security-related events
                </p>
              </div>
              <input
                type="checkbox"
                id="security_alerts"
                name="security_alerts"
                checked={notificationSetting.security_alerts}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border p-4 space-y-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
            Reporting
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium"
                  htmlFor="weekly_reports"
                >
                  Weekly Reports
                </label>
                <p className="text-xs text-muted-foreground">
                  Send weekly activity reports to administrators
                </p>
              </div>
              <input
                type="checkbox"
                id="weekly_reports"
                name="weekly_reports"
                checked={notificationSetting.weekly_reports}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium"
                  htmlFor="marketing_emails"
                >
                  Marketing Emails
                </label>
                <p className="text-xs text-muted-foreground">
                  Send promotional emails to users
                </p>
              </div>
              <input
                type="checkbox"
                id="marketing_emails"
                name="marketing_emails"
                checked={notificationSetting.marketing_emails}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border p-4 space-y-3">
          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
            Notification Preferences
          </label>
          <p className="text-sm">
            Here you can customize which events trigger system notifications.
            Individual users can override these settings in their personal
            preferences.
          </p>
          <div className="grid grid-cols-1 gap-2 mt-4 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="new_user_registration"
                name="new_user_registration"
                checked={notificationSetting.new_user_registration}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="new_user_registration"
              >
                New User Registration
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="new_event_creation"
                name="new_event_creation"
                checked={notificationSetting.new_event_creation}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="new_event_creation"
              >
                New Event Creation
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="new_applications"
                name="new_applications"
                checked={notificationSetting.new_applications}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="new_applications"
              >
                New Applications
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="user_feedback"
                name="user_feedback"
                checked={notificationSetting.user_feedback}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="user_feedback"
              >
                User Feedback
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="items-center flex justify-between border-t p-4">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          onClick={() => {
            setNotificationSetting({
              system_email_notifications: false,
              admin_alerts: false,
              security_alerts: false,
              weekly_reports: false,
              marketing_emails: false,
              new_user_registration: false,
              new_applications: false,
              new_event_creation: false,
              user_feedback: false,
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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

export default NotificationSettings;
