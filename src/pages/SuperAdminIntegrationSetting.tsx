import axiosInstance from "@/utils/axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface IntegrationSettings {
  // Email Integration
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;

  // Social Media Integration
  googleLoginEnabled: boolean;
  linkedinLoginEnabled: boolean;
}

const IntegrationSettings = () => {
  const [settings, setSettings] = useState<IntegrationSettings>({
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    googleLoginEnabled: false,
    linkedinLoginEnabled: false,
  });

  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/super-admin//integration-settings"
      );
      const data = response.data;
      setSettings(data.data);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load integration settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof IntegrationSettings,
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const testEmailConnection = async () => {
    try {
      setTestingConnection(true);
      const response = await axiosInstance.post(
        "/super-admin/test-email-connection",
        {
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpUsername: settings.smtpUsername,
          smtpPassword: settings.smtpPassword,
        }
      );

      const result = await response.data;

      if (response.status === 200) {
        toast.success("Email connection test successful!");
      } else {
        toast.error(result.message || "Email connection test failed");
      }
    } catch (error) {
      console.error("Error testing email connection:", error);
      toast.error("Failed to test email connection");
    } finally {
      setTestingConnection(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        "/super-admin/integration-settings",
        settings
      );

      if (response.status === 200) {
        toast.success("Integration settings saved successfully!");
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save integration settings");
    } finally {
      setLoading(false);
    }
  };

  const resetToDefault = () => {
    setSettings({
      smtpHost: "",
      smtpPort: "587",
      smtpUsername: "",
      smtpPassword: "",
      googleLoginEnabled: false,
      linkedinLoginEnabled: false,
    });
    toast.success("Settings reset to default values");
  };

  if (loading && !settings.smtpHost) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-server h-5 w-5"
          >
            <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
            <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
            <line x1="6" x2="6.01" y1="6" y2="6"></line>
            <line x1="6" x2="6.01" y1="18" y2="18"></line>
          </svg>
          Integration Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure third-party service integrations
        </p>
      </div>

      <div className="p-6 pt-0 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* <div className="rounded-md border p-4 space-y-3">
            <div className="flex items-center gap-2">
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
                className="lucide lucide-key h-5 w-5 text-blue-500"
              >
                <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"></path>
                <path d="m21 2-9.6 9.6"></path>
                <circle cx="7.5" cy="15.5" r="5.5"></circle>
              </svg>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
                API Keys
              </label>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="google-analytics"
                >
                  Google Analytics ID
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
                    id="google-analytics"
                    value="UA-12345678-1"
                  />
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-3">
                    Verify
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="recaptcha"
                >
                  reCAPTCHA Site Key
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
                    id="recaptcha"
                    value="6LeIxAcT-EXAMPLE"
                  />
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-3">
                    Test
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="stripe-key"
                >
                  Stripe Public Key
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
                    id="stripe-key"
                    value="pk_test_EXAMPLE"
                  />
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-3">
                    Verify
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="mailchimp-key"
                >
                  Mailchimp API Key
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
                    id="mailchimp-key"
                    value="XXXX-us6"
                  />
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-3">
                    Validate
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Used for email marketing campaigns</p>
              </div>
            </div>
          </div> */}
          <div className="rounded-md border p-4 space-y-3">
            <div className="flex items-center gap-2">
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
                className="lucide lucide-mail h-5 w-5 text-blue-500"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
                Email Integration
              </label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="smtp-host"
                >
                  SMTP Host
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id="smtp-host"
                  value={settings.smtpHost}
                  onChange={(e) =>
                    handleInputChange("smtpHost", e.target.value)
                  }
                  placeholder="smtp.example.com"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="smtp-port"
                >
                  SMTP Port
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id="smtp-port"
                  value={settings.smtpPort}
                  onChange={(e) =>
                    handleInputChange("smtpPort", e.target.value)
                  }
                  placeholder="587"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="smtp-user"
                >
                  SMTP Username
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id="smtp-user"
                  value={settings.smtpUsername}
                  onChange={(e) =>
                    handleInputChange("smtpUsername", e.target.value)
                  }
                  placeholder="notifications@startupconnect.com"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="smtp-pass"
                >
                  SMTP Password
                </label>
                <input
                  type="password"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id="smtp-pass"
                  value={settings.smtpPassword}
                  onChange={(e) =>
                    handleInputChange("smtpPassword", e.target.value)
                  }
                  placeholder="••••••••••••"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                onClick={testEmailConnection}
                disabled={
                  testingConnection ||
                  !settings.smtpHost ||
                  !settings.smtpUsername
                }
              >
                {testingConnection ? "Testing..." : "Test Connection"}
              </button>
            </div>
          </div>

          <div className="rounded-md border p-4 space-y-3">
            <div className="flex items-center gap-2">
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
                className="lucide lucide-globe h-5 w-5 text-blue-500"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                <path d="M2 12h20"></path>
              </svg>
              <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-medium">
                Social Media Integration
              </label>
            </div>
            <div className="space-y-4">
              {/* <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium">
                    Facebook Login
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Allow users to sign in with Facebook
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4" />
              </div> */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium">
                    Google Login
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Allow users to sign in with Google
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={settings.googleLoginEnabled}
                  onChange={(e) =>
                    handleInputChange("googleLoginEnabled", e.target.checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium">
                    LinkedIn Login
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Allow users to sign in with LinkedIn
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={settings.linkedinLoginEnabled}
                  onChange={(e) =>
                    handleInputChange("linkedinLoginEnabled", e.target.checked)
                  }
                />
              </div>
              {/* <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium">
                    Twitter Login
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Allow users to sign in with Twitter
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="items-center flex justify-between border-t p-4">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          onClick={resetToDefault}
          disabled={loading}
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
          onClick={saveSettings}
          disabled={loading}
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

export default IntegrationSettings;
