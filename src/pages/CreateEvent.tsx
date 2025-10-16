import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import API_CONSTANTS from "../utils/apiConstants";
import Input from "@/components/UI/Input";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import LocationPicker from "@/components/LocationPicker";
import FormBuilder from "./FormBuilder";
import RichTextEditor from "@/components/RichTextEditor";
import { EventInterface } from "@/types/event";
import { updateEventSlice } from "@/reudux/slices/eventSlice";
import { useDispatch } from "react-redux";

interface EventFormData {
  id?: string; // UUID
  title?: string | null;
  description?: string | null;
  start_date?: string | null; // ISO Date string (YYYY-MM-DD)
  type?: string | null;
  location?: string | null;
  created_at?: string | null; // ISO timestamp
  updated_at?: string | null; // ISO timestamp
  created_by?: string | null; // UUID
  website?: string | null;
  banner?: string | null;
  judges_emails?: string[] | null;
  stages?: any[] | null; // JSON[] can be any structure – replace 'any' with a specific type if known
  coordinates?: number[] | null; // [latitude, longitude]
}

interface Stage {
  id: string;
  name: string;
  description: string;
  start_date: string;
  start_time: string;
}

const CreateEvent = () => {
  const dispatch = useDispatch();
  const { id: eventIdFromParam } = useParams();

  const [event, setEvent] = useState<EventInterface>({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fields, setFields] = useState<any[]>([]);
  const [stages, setStages] = useState<Stage[]>([
    {
      id: "1",
      name: "",
      description: "",
      start_date: "",
      start_time: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);

  const [errorFields, setErrorFields] = useState<EventFormData>({
    title: "",
    description: "",
    start_date: "",
    location: "",
    type: "",
    website: "",
    created_by: "",
    stages: [],
  });
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionStep, setQuestionStep] = useState(1);
  const [newQuestionType, setNewQuestionType] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<any>({
    label: "",
    type: "",
    required: false,
    options: [""],
  });

  const isSaveDisabled =
    !newQuestion.label.trim() ||
    ((newQuestionType === "radio" || newQuestionType === "checkbox") &&
      (!newQuestion.options.length ||
        newQuestion.options.some((opt: string) => !opt.trim())));

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const [stageErrors, setStageErrors] = useState<
    Record<string, Partial<Record<keyof Stage, string>>>
  >({});

  const validateStageOrder = (
    stages: Stage[]
  ): Record<string, Partial<Record<keyof Stage, string>>> => {
    const stageOrderErrors: Record<
      string,
      Partial<Record<keyof Stage, string>>
    > = {};

    for (let i = 1; i < stages.length; i++) {
      const currentStage = stages[i];
      const previousStage = stages[i - 1];

      if (currentStage.start_date && previousStage.start_date) {
        const currentDate = new Date(currentStage.start_date);
        const previousDate = new Date(previousStage.start_date);

        // Check if current stage date is before previous stage date
        if (currentDate < previousDate) {
          if (!stageOrderErrors[currentStage.id]) {
            stageOrderErrors[currentStage.id] = {};
          }
          stageOrderErrors[currentStage.id].start_date = `Stage ${
            i + 1
          } date cannot be before Stage ${i} date`;
        }
        // Check if dates are the same, then compare times
        else if (currentDate.getTime() === previousDate.getTime()) {
          if (currentStage.start_time && previousStage.start_time) {
            const currentTime = currentStage.start_time;
            const previousTime = previousStage.start_time;

            // Convert time strings to minutes for comparison
            const currentTimeMinutes = currentTime
              .split(":")
              .reduce((acc, time) => 60 * acc + +time, 0);
            const previousTimeMinutes = previousTime
              .split(":")
              .reduce((acc, time) => 60 * acc + +time, 0);

            if (currentTimeMinutes <= previousTimeMinutes) {
              if (!stageOrderErrors[currentStage.id]) {
                stageOrderErrors[currentStage.id] = {};
              }
              stageOrderErrors[currentStage.id].start_time = `Stage ${
                i + 1
              } time must be after Stage ${i} time on the same date`;
            }
          }
        }
      }
    }

    return stageOrderErrors;
  };

  const validateForm = (): EventFormData => {
    const newStageErrors: Record<
      string,
      Partial<Record<keyof Stage, string>>
    > = {};

    // Validate individual stage fields
    stages.forEach((stage) => {
      const errors: Partial<Record<keyof Stage, string>> = {};

      if (!stage.name.trim()) {
        errors.name = "Stage name is required";
      }

      if (!stage.start_date.trim()) {
        errors.start_date = "Start date is required";
      }

      if (Object.keys(errors).length > 0) {
        newStageErrors[stage.id] = errors;
      }
    });

    // Validate stage chronological order
    const stageOrderErrors = validateStageOrder(stages);

    // Merge stage order errors with field validation errors
    Object.keys(stageOrderErrors).forEach((stageId) => {
      if (!newStageErrors[stageId]) {
        newStageErrors[stageId] = {};
      }
      Object.assign(newStageErrors[stageId], stageOrderErrors[stageId]);
    });

    setStageErrors(newStageErrors);

    return {
      created_by: "",
      website: event?.website?.trim()
        ? isValidWebsite(event.website)
          ? ""
          : "Add valid website"
        : "Add valid website",
      title: event?.title?.trim() ? "" : "Title is required",
      description: "",
      start_date: "",
      location: "",
      type: event?.type ? "" : "Type is required",
      banner: bannerPreview ? "" : "Banner is required",
    };
  };

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  const checkAdminStatus = async () => {
    if (!userId) return;
    try {
      const res = await axiosInstance.post(API_CONSTANTS.CHECK_ADMIN_USER, {
        id: userId,
      });
      // Normalize different response shapes and extract a boolean:
      // Possible responses seen in the wild:
      // - true
      // - { isAdmin: true }
      // - { data: true }
      // - { data: { isAdmin: true } }
      const val = res?.data;
      const resolvedBool =
        typeof val === "boolean"
          ? val
          : val && typeof val.isAdmin === "boolean"
          ? val.isAdmin
          : val && typeof val.data === "boolean"
          ? val.data
          : val && val.data && typeof val.data.isAdmin === "boolean"
          ? val.data.isAdmin
          : false;

      setIsSuperAdmin(resolvedBool);
    } catch (error) {
      console.error("Failed to check admin status:", error);
      setIsSuperAdmin(false);
    }
  };

  useEffect(() => {
    if (userId) {
      checkAdminStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const errorFields = validateForm();
    const hasFormErrors = Object.values(errorFields).some(
      (value) => value !== ""
    );
    const hasStageErrors = Object.keys(stageErrors).length > 0;
    if (hasFormErrors || hasStageErrors) {
      toast.error("Please fill all required fields and fix validation errors");
      setErrorFields(errorFields);
      setLoading(false);
      return;
    }
    try {
      setErrorFields({
        title: "",
        description: "",
        start_date: "",
        location: "",
        type: "",
        website: "",
        created_by: "",
        banner: "",
      });
      setSuccess(null);

      const formattedData = {
        ...event,
        start_date: stages[0].start_date || event.start_date,
        stages,
        location: location?.address || "",
        location_name: location?.buildingName || "",
      };

      const formDataToSend = new FormData();
      formDataToSend.append("title", formattedData?.title || "");
      formDataToSend.append("description", formattedData?.description || "");
      formDataToSend.append("location", formattedData?.location || "");
      formDataToSend.append(
        "location_name",
        formattedData?.location_name || ""
      );
      formDataToSend.append("start_date", formattedData?.start_date || "");
      formDataToSend.append("created_by", userId || "");
      formDataToSend.append("type", formattedData?.type || "");
      formDataToSend.append("website", formattedData?.website || "");
      formDataToSend.append(
        "coordinates",
        JSON.stringify([location?.lat || 0, location?.lng || 0])
      );
      formDataToSend.append("status", "pending");
      formDataToSend.append(
        "stages",
        JSON.stringify(formattedData?.stages || [])
      );

      const bannerInput = document.getElementById(
        "event-banner-input"
      ) as HTMLInputElement;
      if (bannerInput?.files?.[0]) {
        formDataToSend.append("banner", bannerInput.files[0]);
      }
      let response;
      if (eventIdFromParam || event.id) {
        response = await axiosInstance.put(
          API_CONSTANTS.EDIT_EVENT(eventIdFromParam || event.id || ""),
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          toast.success("Event updated successfully!");
          setSuccess("Event updated successfully!");
          setStep(2);
        } else {
          toast.error("Failed to update event. Please try again.");
        }
      } else {
        response = await axiosInstance.post(
          API_CONSTANTS.ADD_EVENT,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const data = response.data;
        if (data.event && data.event.id) {
          setEvent({
            ...event,
            id: data.event.id,
          });
          toast.success("Event created successfully!");
          setStep(2);
        } else {
          toast.error("Something went wrong!");
        }
      }
      dispatch(
        updateEventSlice({
          status: "error",
          data: null,
          loading: false,
        })
      );
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };
  const handleFormBuilderSubmit = () => {
    if (eventIdFromParam) {
      navigate("/event/manage/" + event.id);
    } else {
      // if (isSuperAdmin) {
      //   // Redirect super admin to the external admin console
      //   navigate("/super-admin/events");
      // } else {
      //   navigate("/my-events");
      // }
      navigate(-1);
    }
  };
  const handleBackToEvents = () => {
    setStep(1);
  };

  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(
    null
  );

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
      setErrorFields((prev) => ({
        ...prev,
        banner: "",
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "website" && !isValidWebsite(value)) {
      setErrorFields((prev) => ({
        ...prev,
        website: "Please enter a valid website URL.",
      }));
    } else {
      setErrorFields((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isValidWebsite = (url: string) =>
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/.test(url);

  const handleRemoveBanner = () => {
    setBannerPreview(null);
    (document.getElementById("event-banner-input") as HTMLInputElement).value =
      "";
    setErrorFields((prev) => ({
      ...prev,
      banner: "Banner is required",
    }));
  };

  const handleStageChange = (
    index: number,
    field: keyof Stage,
    value: string
  ) => {
    const newStages = [...stages];
    newStages[index] = {
      ...newStages[index],
      [field]: value,
    };
    setStages(newStages);

    // Clear existing errors for this field
    if (stageErrors[newStages[index].id]?.[field]) {
      const updatedErrors = { ...stageErrors };
      if (updatedErrors[newStages[index].id]) {
        delete updatedErrors[newStages[index].id][field];

        if (Object.keys(updatedErrors[newStages[index].id]).length === 0) {
          delete updatedErrors[newStages[index].id];
        }
      }
      setStageErrors(updatedErrors);
    }

    // If date or time was changed, validate stage order
    if (field === "start_date" || field === "start_time") {
      setTimeout(() => {
        const stageOrderErrors = validateStageOrder(newStages);

        if (Object.keys(stageOrderErrors).length > 0) {
          setStageErrors((prev) => {
            const updated = { ...prev };

            // Clear previous order-related errors for all stages
            Object.keys(updated).forEach((stageId) => {
              if (updated[stageId]) {
                // Remove order-related error messages
                if (
                  updated[stageId].start_date &&
                  (updated[stageId].start_date?.includes("cannot be before") ||
                    updated[stageId].start_date?.includes(
                      "Start date is required"
                    ))
                ) {
                  if (
                    updated[stageId].start_date?.includes("cannot be before")
                  ) {
                    delete updated[stageId].start_date;
                  }
                }
                if (
                  updated[stageId].start_time &&
                  updated[stageId].start_time?.includes("must be after")
                ) {
                  delete updated[stageId].start_time;
                }

                // Remove empty stage error objects
                if (Object.keys(updated[stageId]).length === 0) {
                  delete updated[stageId];
                }
              }
            });

            // Add new order errors
            Object.keys(stageOrderErrors).forEach((stageId) => {
              if (!updated[stageId]) {
                updated[stageId] = {};
              }
              Object.assign(updated[stageId], stageOrderErrors[stageId]);
            });

            return updated;
          });
        } else {
          // Clear order-related errors if validation passes
          setStageErrors((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((stageId) => {
              if (updated[stageId]) {
                if (
                  updated[stageId].start_date &&
                  updated[stageId].start_date?.includes("cannot be before")
                ) {
                  delete updated[stageId].start_date;
                }
                if (
                  updated[stageId].start_time &&
                  updated[stageId].start_time?.includes("must be after")
                ) {
                  delete updated[stageId].start_time;
                }

                if (Object.keys(updated[stageId]).length === 0) {
                  delete updated[stageId];
                }
              }
            });
            return updated;
          });
        }
      }, 0);
    }
  };

  const addStage = (insertAfterIndex?: number) => {
    const newStage = {
      id: Date.now().toString(),
      name: "",
      description: "",
      start_date: "",
      start_time: "",
    };

    if (insertAfterIndex !== undefined) {
      // Insert after the specified index
      const newStages = [...stages];
      newStages.splice(insertAfterIndex + 1, 0, newStage);
      setStages(newStages);
    } else {
      // Add at the end (fallback)
      setStages([...stages, newStage]);
    }
  };

  const removeStage = (index: number) => {
    if (stages.length > 1) {
      const newStages = stages.filter((_, i) => i !== index);
      setStages(newStages);
    }
  };

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    buildingName: string;
    address: string;
  } | null>(null);
  const preFillData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_EVENT_BY_ID(eventIdFromParam!)
      );
      const data = response.data;
      setEvent(data.event);
      setStages(data.event.stages || []);
      setLocation({
        lat: data.event.coordinates?.[0] || 0,
        lng: data.event.coordinates?.[1] || 0,
        buildingName: data.event.location_name || "",
        address: data.event.location || "",
      });
      setBannerPreview(data.event.banner || null);
    } catch (error) {
      console.error("Error fetching event data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (eventIdFromParam) {
      preFillData();
    } else {
      setLoading(false);
    }
  }, [eventIdFromParam]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-auto">
        {step === 1 ? (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              {success && (
                <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {eventIdFromParam ? "Edit Event" : "Create New Event"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {eventIdFromParam
                      ? "Edit the form below to update your event"
                      : "Fill out the form below to create a new event"}
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Input
                        value={event.title || ""}
                        handleChange={handleInputChange}
                        label="Event Title"
                        name="title"
                        type="text"
                        placeholder="Enter event title"
                        description="A clear, concise title for your event"
                        error={errorFields.title || ""}
                        required={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Event Banner <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`border-2 border-dashed rounded-lg flex items-center justify-center relative bg-gray-100 min-h-[180px] cursor-pointer group transition ${
                          errorFields.banner
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        onClick={() =>
                          !bannerPreview &&
                          document.getElementById("event-banner-input")?.click()
                        }
                      >
                        {bannerPreview ? (
                          <div className="w-full h-full flex items-center justify-center relative">
                            <img
                              src={bannerPreview}
                              alt="Event Banner Preview"
                              className="object-contain max-h-48 w-full rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-lg">
                              <button
                                type="button"
                                className="bg-white text-black px-3 py-1 rounded shadow mr-2 flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  document
                                    .getElementById("event-banner-input")
                                    ?.click();
                                }}
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                                  <polyline points="7 9 12 4 17 9" />
                                  <line x1="12" y1="4" x2="12" y2="16" />
                                </svg>
                                Change Image
                              </button>
                              <button
                                type="button"
                                className="bg-red-600 text-white px-3 py-1 rounded shadow flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveBanner();
                                }}
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-12 w-full">
                            <div className="bg-gray-200 rounded-full p-6 mb-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="text-gray-400"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                />
                                <path d="M8.5 14.5 11 17l2.5-3.5L19 19H5l3.5-4.5z" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                              </svg>
                            </div>
                            <div className="font-semibold text-lg mb-1">
                              Upload Event Banner
                            </div>
                            <div className="text-sm text-gray-500 text-center">
                              Recommended size: 1200 x 400px (3:1 ratio). PNG,
                              JPG up to 5MB.
                            </div>
                          </div>
                        )}
                        <input
                          id="event-banner-input"
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          onChange={handleBannerChange}
                          required={true}
                        />
                      </div>
                      {errorFields.banner && (
                        <div className="text-sm text-red-500 font-normal">
                          {errorFields.banner}
                        </div>
                      )}
                    </div>

                    <RichTextEditor
                      value={event.description || ""}
                      onChange={(value) =>
                        setEvent((prev) => ({
                          ...prev,
                          description: value,
                        }))
                      }
                      label="Event Description"
                      placeholder="Describe your event..."
                      description="Provide details about your event"
                      error={errorFields.description || undefined}
                    />

                    {/* Preview of the rich text */}
                    {/* {event.description && event.description.trim() && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                          Preview
                        </label>
                        <div className="border rounded-md p-3 bg-gray-50">
                          <RichTextDisplay
                            content={event.description}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    )} */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        Event Type<span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="space-y-1">
                        <div className="relative w-full">
                          <select
                            id="type"
                            name="type"
                            value={event.type || "networking"}
                            onChange={handleInputChange}
                            className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="networking" disabled>
                              Select Event Type
                            </option>
                            <option value="networking">Networking</option>
                            <option value="pitch">Pitch</option>
                            <option value="workshop">Workshop</option>
                            <option value="hackathon">Hackathon</option>
                            <option value="meetup">Meetup</option>
                            <option value="conference">Conference</option>
                            <option value="other">Other</option>
                          </select>

                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600 justify-center">
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        {errorFields.type && (
                          <div className="text-sm text-red-500 font-normal">
                            {errorFields.type}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Event Stages</h3>
                      </div>

                      <div className="space-y-4">
                        {stages.map((stage, index) => (
                          <div
                            key={stage.id}
                            className="rounded-lg border bg-card p-6"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  Stage {index + 1}{" "}
                                  <span className="text-red-500 ml-1">*</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => addStage(index)}
                                  className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors bg-blue-600 text-white hover:bg-blue-700 h-8 px-3 py-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3 w-3"
                                  >
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5v14"></path>
                                  </svg>
                                  Add Stage
                                </button>
                                {stages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeStage(index)}
                                    className="text-red-500 hover:text-red-700"
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
                                      className="h-5 w-5"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label
                                  className="text-sm font-medium leading-none"
                                  htmlFor={`stage_name_${index}`}
                                >
                                  Stage Name
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                  type="text"
                                  id={`stage_name_${index}`}
                                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                    stageErrors[stage.id]?.name
                                      ? "border-red-500"
                                      : "border-input bg-background"
                                  }`}
                                  value={stage.name}
                                  onChange={(e) =>
                                    handleStageChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                                {stageErrors[stage.id]?.name && (
                                  <p className="text-sm text-red-500">
                                    {stageErrors[stage.id]?.name}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <label
                                  className="text-sm font-medium leading-none"
                                  htmlFor={`stage_description_${index}`}
                                >
                                  Stage Description
                                </label>
                                <textarea
                                  id={`stage_description_${index}`}
                                  className={`flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                    stageErrors[stage.id]?.description
                                      ? "border-red-500"
                                      : "border-input bg-background"
                                  }`}
                                  value={stage.description}
                                  onChange={(e) =>
                                    handleStageChange(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                />
                                {stageErrors[stage.id]?.description && (
                                  <p className="text-sm text-red-500">
                                    {stageErrors[stage.id]?.description}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2 flex flex-col">
                                <label
                                  className="text-sm font-medium leading-none"
                                  htmlFor={`stage_start_date_${index}`}
                                >
                                  Start Date
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <DatePicker
                                  selected={
                                    stage.start_date
                                      ? new Date(stage.start_date + "T00:00:00")
                                      : null
                                  }
                                  onChange={(date: Date | null) => {
                                    if (date) {
                                      const year = date.getFullYear();
                                      const month = String(
                                        date.getMonth() + 1
                                      ).padStart(2, "0");
                                      const day = String(
                                        date.getDate()
                                      ).padStart(2, "0");
                                      const formattedDate = `${year}-${month}-${day}`;
                                      handleStageChange(
                                        index,
                                        "start_date",
                                        formattedDate
                                      );
                                    }
                                  }}
                                  className={`flex h-10 rounded-md border px-3 py-2 text-sm w-full cursor-pointer ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                    stageErrors[stage.id]?.start_date
                                      ? "border-red-500"
                                      : "border-input bg-background"
                                  }`}
                                  dateFormat="MMMM d, yyyy"
                                  placeholderText="Select a date"
                                  popperPlacement="bottom-start"
                                  onKeyDown={(e) => e.preventDefault()}
                                  onFocus={(e) => e.target.blur()}
                                />
                                {stageErrors[stage.id]?.start_date && (
                                  <p className="text-sm text-red-500">
                                    {stageErrors[stage.id]?.start_date}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2 flex flex-col">
                                <label
                                  className="text-sm font-medium leading-none"
                                  htmlFor={`stage_start_time_${index}`}
                                >
                                  Start Time
                                </label>
                                <DatePicker
                                  selected={
                                    stages[index]?.start_time
                                      ? new Date(
                                          `1970-01-01T${stages[index].start_time}:00`
                                        )
                                      : null
                                  }
                                  onChange={(date: Date | null) =>
                                    handleStageChange(
                                      index,
                                      "start_time",
                                      date
                                        ? date
                                            .toLocaleTimeString("en-GB", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: false,
                                            })
                                            .slice(0, 5)
                                        : ""
                                    )
                                  }
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  dateFormat="HH:mm"
                                  placeholderText="Select Start Time"
                                  timeFormat="HH:mm"
                                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                                    stageErrors[stage.id]?.start_time
                                      ? "border-red-500"
                                      : "border-input bg-background"
                                  }`}
                                  onKeyDown={(e) => e.preventDefault()}
                                  onFocus={(e) => e.target.blur()}
                                />
                                {stageErrors[stage.id]?.start_time && (
                                  <p className="text-sm text-red-500">
                                    {stageErrors[stage.id]?.start_time}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="location_link"
                        className="text-sm font-medium text-gray-900"
                      >
                        Location
                      </label>
                      <LocationPicker
                        onLocationSelect={setLocation}
                        locationSelect={
                          location || {
                            lat: 0,
                            lng: 0,
                            buildingName: "",
                            address: "",
                          }
                        } // Pass the current location for prefill
                      />

                      {errorFields.location && (
                        <p className="text-sm text-red-500">
                          {errorFields.location}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="text"
                        name="website"
                        value={event.website || ""}
                        handleChange={handleInputChange}
                        onBlur={handleBlur}
                        label="Website"
                        placeholder="https://example.com"
                        required
                        error={errorFields.website || ""}
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          // If super admin, redirect to external admin console
                          // if (isSuperAdmin) {
                          //   navigate("/super-admin/events");
                          // } else {
                          //   navigate("/my-events");
                          // }
                          navigate(-1)
                        }}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        onClick={(e) => handleSubmit(e)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Continue"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : step === 2 ? (
          <FormBuilder
            event={event}
            onSubmit={handleFormBuilderSubmit}
            handleBackToEvents={handleBackToEvents}
          />
        ) : (
          <>render event preview</>
          // renderEventPreview()
        )}
      </div>
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowQuestionModal(false)}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Questions</h2>
            {questionStep === 1 && (
              <>
                <div className="mb-4 font-semibold">Add Questions</div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { type: "text", label: "Short Text", icon: "T" },
                    { type: "textarea", label: "Long Text", icon: "≡" },
                    { type: "radio", label: "Multiple Choice", icon: "◯" },
                    { type: "checkbox", label: "Checkboxes", icon: "☑" },
                    { type: "date", label: "Date", icon: "📅" },
                    { type: "time", label: "Time", icon: "⏰" },
                    { type: "file", label: "File Upload", icon: "⤴" },
                    { type: "rating", label: "Rating", icon: "★" },
                  ].map((q) => (
                    <button
                      key={q.type}
                      className="flex flex-col items-center p-4 rounded hover:bg-gray-100 transition"
                      onClick={() => {
                        setNewQuestionType(q.type);
                        setNewQuestion((prev: any) => ({
                          ...prev,
                          type: q.type,
                        }));
                        setQuestionStep(2);
                      }}
                    >
                      <span className="text-2xl mb-2">{q.icon}</span>
                      <span className="text-sm">{q.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() => setShowQuestionModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {questionStep === 2 && (
              <>
                {/* Question Config UI */}
                <div className="mb-4">
                  <input
                    className="w-full border rounded px-3 py-2 mb-2"
                    placeholder="Write text here"
                    value={newQuestion.label}
                    onChange={(e) =>
                      setNewQuestion((prev: any) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                  />
                  {(newQuestionType === "radio" ||
                    newQuestionType === "checkbox") && (
                    <div>
                      {newQuestion.options.map((opt: string, idx: number) => (
                        <div key={idx} className="flex items-center mb-1">
                          <input
                            type={newQuestionType}
                            className="mr-2"
                            disabled
                          />
                          <input
                            className="border rounded px-2 py-1 flex-1"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const opts = [...newQuestion.options];
                              opts[idx] = e.target.value;
                              setNewQuestion((prev: any) => ({
                                ...prev,
                                options: opts,
                              }));
                            }}
                          />
                          <button
                            className="ml-2 text-red-500"
                            onClick={() => {
                              setNewQuestion((prev: any) => ({
                                ...prev,
                                options: prev.options.filter(
                                  (_: any, i: number) => i !== idx
                                ),
                              }));
                            }}
                            disabled={newQuestion.options.length <= 1}
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                      <button
                        className="text-blue-600 text-sm mt-1"
                        onClick={(e) => {
                          e.preventDefault();
                          setNewQuestion((prev: any) => ({
                            ...prev,
                            options: [...prev.options, ""],
                          }));
                        }}
                      >
                        + Add Option
                      </button>
                    </div>
                  )}
                  <div className="flex items-center mt-2">
                    <label htmlFor="question-required">
                      <input
                        type="checkbox"
                        className="mr-2"
                        name="question-required"
                        id="question-required"
                        checked={newQuestion.required}
                        onChange={(e) =>
                          setNewQuestion((prev: any) => ({
                            ...prev,
                            required: e.target.checked,
                          }))
                        }
                      />
                      <span>Required</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() => setQuestionStep(1)}
                  >
                    Back
                  </button>
                  <div>
                    <button
                      className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 mr-2"
                      onClick={() => setShowQuestionModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${
                        isSaveDisabled
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      // In your modal's save button onClick:
                      onClick={() => {
                        if (isSaveDisabled) return;

                        const trimmedLabel = newQuestion.label
                          .trim()
                          .toLowerCase();

                        const isDuplicate = fields.some((field, index) => {
                          // Skip the current field when editing
                          if (
                            editingFieldIndex !== null &&
                            index === editingFieldIndex
                          )
                            return false;
                          return (
                            field.label.trim().toLowerCase() === trimmedLabel
                          );
                        });

                        if (isDuplicate) {
                          toast.error(
                            "Duplicate question! Please enter a unique question."
                          );
                          return;
                        }

                        if (editingFieldIndex !== null) {
                          // Update existing field
                          const updatedFields = [...fields];
                          updatedFields[editingFieldIndex] = {
                            ...newQuestion,
                            id: fields[editingFieldIndex].id,
                          };
                          setFields(updatedFields);
                          setEditingFieldIndex(null);
                        } else {
                          // Add new field
                          setFields([
                            ...fields,
                            { ...newQuestion, id: Date.now() },
                          ]);
                        }

                        setShowQuestionModal(false);
                      }}
                      disabled={isSaveDisabled}
                    >
                      Save Question
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEvent;
