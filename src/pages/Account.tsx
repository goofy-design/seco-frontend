import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./../reudux/store"; // Fixed typo: reudux -> redux
import {
  fetchAccountById,
  updateAccount,
  updateNotificationSettings,
  IAccount,
} from "../reudux/slices/accountSlice"; // Fixed typo: reudux -> redux
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";
import API_CONSTANTS from "@/utils/apiConstants";

const Account = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { currentAccount, loading } = useSelector(
    (state: RootState) => state.account
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState("Profile");
  const [formData, setFormData] = useState<Partial<IAccount>>({
    full_name: "",
    avatar_url: "",
    website: "",
    location: "",
    company_name: "",
    company_description: "",
    date: "",
    industry: "",
    showInvestors: true, // Ensure this matches IAccount type
    // Investor profile fields
    availability: "Available",
    bio: "",
    sectors: [],
    expertise: [],
    specialization: "",
    experience: "",
    image: "",
    linkedin: "",
  });
  const [notificationSettings, setNotificationSettings] = useState<{
    email_notification: boolean;
    new_event_notification: boolean;
  }>({
    email_notification: true,
    new_event_notification: true,
  });

  const tabs = ["Profile", "Security", "Notifications"];

  // Fetch account data on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccountById(user.id));
    }
  }, [dispatch, user?.id]); // Added ?.id for safety

  // Update local state when account data is fetched
  useEffect(() => {
    if (currentAccount) {
      setFormData({
        full_name: currentAccount.full_name || "",
        avatar_url: currentAccount.avatar_url || "",
        website: currentAccount.website || "",
        location: currentAccount.location || "",
        company_name: currentAccount.company_name || "",
        company_description: currentAccount.company_description || "",
        date: currentAccount.date || "",
        industry: currentAccount.industry || "",
        showInvestors: currentAccount.showInvestors ?? true, // Use nullish coalescing
        // Investor profile fields
        availability: currentAccount.availability || "Available",
        bio: currentAccount.bio || "",
        sectors: currentAccount.sectors || [],
        expertise: currentAccount.expertise || [],
        specialization: currentAccount.specialization || "",
        experience: currentAccount.experience || "",
        image: currentAccount.image || "",
        linkedin: currentAccount.linkedin || "",
      });

      setNotificationSettings({
        email_notification: currentAccount.email_notification ?? true,
        new_event_notification: currentAccount.new_event_notification ?? true,
      });
    }
  }, [currentAccount]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, type, value } = target;

    let newValue: string | boolean | string[] = value;

    if (type === "checkbox" && target instanceof HTMLInputElement) {
      newValue = target.checked;
    }
    // For array fields, just store the string value during typing
    // We'll process it into an array on blur

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleArrayFieldBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "sectors" || name === "expertise") {
      // Process comma-separated values into array only on blur
      const arrayValue = value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      setFormData((prev) => ({
        ...prev,
        [name]: arrayValue,
      }));
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formData)
        .filter(([_, value]) => {
          if (Array.isArray(value)) {
            return true; // Always include arrays, even if empty
          }
          return value !== undefined; // Only filter out undefined values, allow empty strings
        })
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return [key, value];
          }
          if (typeof value === "string") {
            return [key, value.trim()];
          }
          return [key, value];
        })
    ) as Partial<IAccount>; // Type assertion to match IAccount

    if (user?.id) {
      const result = await dispatch(
        updateAccount({
          id: user.id,
          accountData: filteredData,
        })
      );
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    }
  };

  const handleNotificationToggle = (
    setting: "email_notification" | "new_event_notification"
  ) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };
  const handleResetPassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    const hashedCurrentPassword = await hashPassword(currentPassword);
    const hashedPassword = await hashPassword(newPassword);
    const response = await axiosInstance.post(
      API_CONSTANTS.RESET_PASSWORD_CURRENT,
      {
        currentPassword: hashedCurrentPassword,
        newPassword: hashedPassword,
      }
    );
    if (response.status === 200) {
      toast.success("Password reset successfully!");
    } else {
      toast.error("Failed to reset password.");
    }
  };

  const handleSaveNotifications = async (e: FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      try {
        const result = await dispatch(
          updateNotificationSettings({
            id: user.id,
            ...notificationSettings,
          })
        ).unwrap();
        if (result) {
          setNotificationSettings({
            email_notification: result.email_notification ?? true,
            new_event_notification: result.new_event_notification ?? true,
          });
          toast.success("Notification settings have been updated!");
        }
      } catch (error) {
        toast.error("Failed to update notification settings");
        console.error("Failed to update notification settings:", error);
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Account</h1>
            <p className="text-muted-foreground">
              Manage your profile and preferences.
            </p>
          </div>

          <div dir="ltr" data-orientation="horizontal" className="w-full">
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-8"
              tabIndex={0}
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab ? "true" : "false"}
                  data-state={activeTab === tab ? "active" : "inactive"}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  tabIndex={0}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Profile" && (
              <div className="space-y-8">
                {/* Edit Profile */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">
                      Edit Profile
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Update your profile information here.
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <form className="space-y-4" onSubmit={handleProfileSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="full_name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name || ""}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="avatar_url"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Avatar URL
                          </label>
                          <input
                            type="url"
                            id="avatar_url"
                            name="avatar_url"
                            value={formData.avatar_url || ""}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="website"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Website
                          </label>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website || ""}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="location"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location || ""}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="company_name"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="company_name"
                          name="company_name"
                          value={formData.company_name || ""}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="company_description"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Company Description
                        </label>
                        <textarea
                          id="company_description"
                          name="company_description"
                          value={formData.company_description || ""}
                          onChange={handleInputChange}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="date"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Founded Date
                          </label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date || ""}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="industry"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Industry
                          </label>
                          <input
                            type="text"
                            id="industry"
                            name="industry"
                            value={formData.industry || ""}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                      </div>

                      {/* Investor Profile Section */}
                      <div className="border-t pt-6">
                        <h4 className="text-lg font-semibold mb-4">
                          Investor Profile
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label
                              htmlFor="availability"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Availability
                            </label>
                            <select
                              id="availability"
                              name="availability"
                              value={formData.availability || "Available"}
                              onChange={handleInputChange}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            >
                              <option value="Available">Available</option>
                              <option value="Unavailable">Unavailable</option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="specialization"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Specialization
                            </label>
                            <input
                              type="text"
                              id="specialization"
                              name="specialization"
                              value={formData.specialization || ""}
                              onChange={handleInputChange}
                              placeholder="e.g., Early Stage Ventures, Tech Startups"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="bio"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio || ""}
                            onChange={handleInputChange}
                            placeholder="Tell us about your background and investment philosophy..."
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label
                              htmlFor="sectors"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Investment Sectors
                            </label>
                            <input
                              type="text"
                              id="sectors"
                              name="sectors"
                              value={
                                Array.isArray(formData.sectors)
                                  ? formData.sectors.join(", ")
                                  : formData.sectors || ""
                              }
                              onChange={handleInputChange}
                              onBlur={handleArrayFieldBlur}
                              placeholder="e.g., Technology, Healthcare, Finance (comma-separated)"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="expertise"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Areas of Expertise
                            </label>
                            <input
                              type="text"
                              id="expertise"
                              name="expertise"
                              value={
                                Array.isArray(formData.expertise)
                                  ? formData.expertise.join(", ")
                                  : formData.expertise || ""
                              }
                              onChange={handleInputChange}
                              onBlur={handleArrayFieldBlur}
                              placeholder="e.g., Product Management, Marketing, Operations (comma-separated)"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <label
                              htmlFor="experience"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Years of Experience
                            </label>
                            <input
                              type="text"
                              id="experience"
                              name="experience"
                              value={formData.experience || ""}
                              onChange={handleInputChange}
                              placeholder="e.g., 10+ years"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="linkedin"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              LinkedIn URL
                            </label>
                            <input
                              type="url"
                              id="linkedin"
                              name="linkedin"
                              value={formData.linkedin || ""}
                              onChange={handleInputChange}
                              placeholder="https://linkedin.com/in/yourprofile"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="image"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Profile Image URL
                            </label>
                            <input
                              type="url"
                              id="image"
                              name="image"
                              value={formData.image || ""}
                              onChange={handleInputChange}
                              placeholder="https://example.com/your-image.jpg"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border bg-background p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-base font-medium">
                              Show in Investors Page
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Allow investors to discover and connect with you
                              in the Investors section.
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="showInvestors"
                              name="showInvestors"
                              checked={formData.showInvestors || false}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <label
                              htmlFor="showInvestors"
                              className={`relative inline-flex h-6 w-11 items-center cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer ${
                                formData.showInvestors
                                  ? "bg-blue-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                                  formData.showInvestors
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      >
                        {loading ? "Saving..." : "Save Profile"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">
                      Profile Information
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      View your profile details.
                    </p>
                  </div>
                  <div className="p-6 pt-0 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        ["Full Name", currentAccount?.full_name || "N/A"],
                        ["Avatar URL", currentAccount?.avatar_url || "N/A"],
                        ["Website", currentAccount?.website || "N/A"],
                        ["Company Name", currentAccount?.company_name || "N/A"],
                        [
                          "Company Description",
                          currentAccount?.company_description || "N/A",
                        ],
                        ["Founded Date", currentAccount?.date || "N/A"],
                        ["Industry", currentAccount?.industry || "N/A"],
                        ["Location", currentAccount?.location || "N/A"],
                        [
                          "Show in Investors",
                          currentAccount?.showInvestors ? "Yes" : "No",
                        ],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-sm font-medium">{label}</p>
                          <p className="truncate overflow-hidden whitespace-nowrap">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Investor Profile Information */}
                    <div className="border-t pt-4 mt-6">
                      <h4 className="text-lg font-semibold mb-4">
                        Investor Profile
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          [
                            "Availability",
                            currentAccount?.availability || "N/A",
                          ],
                          [
                            "Specialization",
                            currentAccount?.specialization || "N/A",
                          ],
                          ["Experience", currentAccount?.experience || "N/A"],
                          ["LinkedIn", currentAccount?.linkedin || "N/A"],
                          ["Profile Image", currentAccount?.image || "N/A"],
                          [
                            "Investment Sectors",
                            currentAccount?.sectors?.join(", ") || "N/A",
                          ],
                          [
                            "Areas of Expertise",
                            currentAccount?.expertise?.join(", ") || "N/A",
                          ],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <p className="text-sm font-medium">{label}</p>
                            <p className="truncate overflow-hidden whitespace-nowrap">
                              {value}
                            </p>
                          </div>
                        ))}
                        <div className="sm:col-span-2">
                          <p className="text-sm font-medium">Bio</p>
                          <p className="text-sm text-muted-foreground">
                            {currentAccount?.bio || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Security Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your password and security preferences.
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="current_password"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      id="current_password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="new_password"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="new_password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="confirm_password"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="confirm_password"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    onClick={handleResetPassword}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage how and when you receive notifications.
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <form
                    className="space-y-6"
                    onSubmit={handleSaveNotifications}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications for important updates.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={notificationSettings.email_notification}
                          data-state={
                            notificationSettings.email_notification
                              ? "checked"
                              : "unchecked"
                          }
                          value={
                            notificationSettings.email_notification
                              ? "on"
                              : "off"
                          }
                          onClick={() =>
                            handleNotificationToggle("email_notification")
                          }
                          className={`
                            peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full 
                            transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
                            focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                            ${
                              notificationSettings.email_notification
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }
                            shadow-md
                          `}
                        >
                          <span
                            data-state={
                              notificationSettings.email_notification
                                ? "checked"
                                : "unchecked"
                            }
                            className={`
                              pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0 
                              transition-transform duration-300 ease-in-out
                              ${
                                notificationSettings.email_notification
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }
                            `}
                          ></span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            New Event Notifications
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Get notified when new events are created in your
                            network.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={
                            notificationSettings.new_event_notification
                          }
                          data-state={
                            notificationSettings.new_event_notification
                              ? "checked"
                              : "unchecked"
                          }
                          value={
                            notificationSettings.new_event_notification
                              ? "on"
                              : "off"
                          }
                          onClick={() =>
                            handleNotificationToggle("new_event_notification")
                          }
                          className={`
                            peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full 
                            transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
                            focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                            ${
                              notificationSettings.new_event_notification
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }
                            shadow-md
                          `}
                        >
                          <span
                            data-state={
                              notificationSettings.new_event_notification
                                ? "checked"
                                : "unchecked"
                            }
                            className={`
                              pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0 
                              transition-transform duration-300 ease-in-out
                              ${
                                notificationSettings.new_event_notification
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }
                            `}
                          ></span>
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      {loading ? "Saving..." : "Save Preferences"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
