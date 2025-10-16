import { EventInterface, FormBuilderData } from "@/types/event";
import API_CONSTANTS from "@/utils/apiConstants";
import axiosInstance from "@/utils/axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface FormBuilderProps {
  event: EventInterface;
  onSubmit: () => void;
  handleBackToEvents: () => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  event,
  onSubmit,
  handleBackToEvents,
}) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [questionStep, setQuestionStep] = useState(1);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState<FormBuilderData>({
    id: null,
    type: "",
    details: {
      label: "",
      options: [],
      hasOtherOption: false,
    },
    order: null,
    required: false,
  });
  const [fields, setFields] = useState<FormBuilderData[]>([]);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    const items = [...fields];
    const draggedItem = items[dragItem.current!];

    // Remove and insert item
    items.splice(dragItem.current!, 1);
    items.splice(dragOverItem.current!, 0, draggedItem);

    dragItem.current = null;
    dragOverItem.current = null;

    setFields(items);
  };

  const handleAddField = () => {
    setShowQuestionModal(true);
    setQuestionStep(1);
    setNewQuestion({
      id: null,
      type: "",
      details: {
        label: "",
        options: [],
        hasOtherOption: false,
      },
      required: false,
      order: null,
    });
  };
  const handleSaveForm = async () => {
    try {
      setLoading(true);

      const userData = localStorage.getItem("user");
      if (!userData) {
        toast.error("Please login to save form");
        return;
      }

      // Transform fields into the required format
      const formFields = fields.map((field, index) => ({
        event_id: event.id,
        type: field.type,
        details: {
          label: field.details.label,
          options:
            field.type === "select" ||
            field.type === "radio" ||
            field.type === "checkbox"
              ? field.details.options
              : undefined,
          hasOtherOption:
            field.type === "checkbox"
              ? field.details.hasOtherOption || false
              : undefined,
        },
        order: index + 1,
        required: field.required || false,
      }));

      if (!event.id) {
        toast.error("Event not found");
        return;
      }
      const response = await axiosInstance.put(
        API_CONSTANTS.REPLACE_FORM_BY_EVENT(event.id),

        formFields
      );

      if (response.status === 200) {
        toast.success("Form fields saved successfully!");
      }
      onSubmit();
    } catch (error) {
      toast.error("Failed to save form fields. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const renderPreviewForm = () => {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Main Form */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Application Details
              </h2>
            </div>

            <div className="p-6 space-y-8">
              {/* Dynamic Form Fields */}
              {fields.map((field) => (
                <div key={field.id} className="space-y-3">
                  <div>
                    <label className="text-base font-medium text-gray-900 block">
                      {field?.details?.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                  </div>

                  {field.type === "text" && (
                    <input
                      type="text"
                      className={`w-full rounded-md border ${"border-gray-300"} bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter your answer"
                      disabled
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      className={`w-full rounded-md border ${"border-gray-300"} bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-y`}
                      placeholder="Enter your answer"
                      disabled
                    />
                  )}

                  {field.type === "radio" && (
                    <div className="space-y-3">
                      {field?.details?.options?.map(
                        (option: string, index: number) => (
                          <label
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="radio"
                              name={field.id || "radio-group"}
                              disabled
                              value={option}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  )}

                  {field.type === "checkbox" && (
                    <div className="space-y-3">
                      {field?.details?.options?.map(
                        (option: string, index: number) => (
                          <label
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="checkbox"
                              disabled
                              value={option}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                            />
                            <span className="text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        )
                      )}
                      {field?.details?.hasOtherOption && (
                        <div className="space-y-2">
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              disabled
                              value="other"
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                            />
                            <span className="text-sm text-gray-700">Other</span>
                          </label>
                          <div className="ml-7">
                            <input
                              type="text"
                              placeholder="Please specify..."
                              disabled
                              className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {field.type === "date" && (
                    <input
                      type="date"
                      className={`w-full rounded-md border ${"border-gray-300"} bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      disabled
                    />
                  )}

                  {field.type === "time" && (
                    <input
                      type="time"
                      className={`w-full rounded-md border ${"border-gray-300"} bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      disabled
                    />
                  )}

                  {field.type === "file" && (
                    <input
                      type="file"
                      className={`w-full rounded-md border ${"border-gray-300"} bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                      disabled
                    />
                  )}
                </div>
              ))}

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      I accept the terms and conditions
                    </span>
                    <p className="text-gray-500 mt-1">
                      I agree to share my application materials with the event
                      organizers and judges.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const isSaveDisabled =
    !newQuestion?.details?.label?.trim() ||
    ((newQuestionType === "radio" || newQuestionType === "checkbox") &&
      (!newQuestion?.details?.options?.length ||
        newQuestion?.details?.options?.some((opt: string) => !opt.trim())));
  const fetchFormFields = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_FORM_BY_EVENT(eventId),
        {
          params: {
            event_id: eventId,
          },
        }
      );
      const data = response.data;
      if (data.forms) {
        setFields(data.forms || []);
      }
    } catch (error) {
      console.error("Error fetching form fields:", error);
      toast.error("Failed to load form fields. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (event.id) {
      fetchFormFields(event.id);
    }
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-3 max-w-4xl mx-auto">
      <div dir="ltr" data-orientation="horizontal" className="mb-6">
        <div
          data-state="active"
          data-orientation="horizontal"
          role="tabpanel"
          aria-labelledby="radix-:r19:-trigger-registration"
          id="radix-:r19:-content-registration"
          tabIndex={0}
          className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{}}
        >
          <div dir="ltr" data-orientation="horizontal" className="w-full">
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-2 mb-4"
              tabIndex={0}
              data-orientation="horizontal"
              style={{ outline: "none" }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "edit"}
                aria-controls="radix-:r1b:-content-edit"
                data-state={activeTab === "edit" ? "active" : "inactive"}
                id="radix-:r1b:-trigger-edit"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeTab === "edit"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("edit")}
              >
                Edit Form
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "preview"}
                aria-controls="radix-:r1b:-content-preview"
                data-state={activeTab === "preview" ? "active" : "inactive"}
                id="radix-:r1b:-trigger-preview"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeTab === "preview"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("preview")}
              >
                Preview Form
              </button>
            </div>
            <div
              data-state={activeTab === "edit" ? "active" : "inactive"}
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-:r1b:-trigger-edit"
              id="radix-:r1b:-content-edit"
              tabIndex={0}
              className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
              style={{
                display: activeTab === "edit" ? "block" : "none",
              }}
            >
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div
                        role="alert"
                        className="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground bg-background text-foreground"
                      >
                        <div className="text-sm [&_p]:leading-relaxed">
                          Build your registration form by adding fields below.
                          Drag and drop to reorder fields.
                        </div>
                      </div>
                      <button
                        className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center"
                        type="button"
                        onClick={handleAddField}
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
                          className="lucide lucide-plus mr-1 h-4 w-4"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>{" "}
                        Add Field
                      </button>
                    </div>
                    <form className="space-y-4">
                      <div className="space-y-4">
                        <div
                          data-rbd-droppable-id="fieldsDroppable"
                          data-rbd-droppable-context-id="0"
                          className="space-y-4"
                        >
                          {fields.length === 0 ? (
                            <div className="text-center p-8 border border-dashed rounded-md text-muted-foreground">
                              No fields added yet. Click "Add Field" below to
                              create your registration form.
                            </div>
                          ) : (
                            fields?.map((field, idx) => (
                              <div
                                key={field.id}
                                draggable
                                onDragStart={() => handleDragStart(idx)}
                                onDragEnter={() => handleDragEnter(idx)}
                                onDragEnd={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="rounded-lg border p-6 mb-4 bg-white shadow flex flex-col gap-2 z-10"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="cursor-move text-gray-400 mr-2">
                                      ⋮⋮
                                    </span>
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-lg">
                                        {field?.details?.label ||
                                          `Question ${idx + 1}`}
                                      </span>
                                      <span className="text-xs text-gray-500 capitalize">
                                        {field.type === "text" && "Short Text"}
                                        {field.type === "textarea" &&
                                          "Long Text"}
                                        {field.type === "radio" &&
                                          "Multiple Choice"}
                                        {field.type === "checkbox" &&
                                          "Checkboxes"}
                                        {field.type === "date" && "Date"}
                                        {field.type === "time" && "Time"}
                                        {field.type === "file" && "File upload"}
                                        {field.type === "rating" && "Rating"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 justify-center">
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={field.required || false}
                                        onChange={(e) => {
                                          const newFields = [...fields];
                                          newFields[idx].required =
                                            e.target.checked;
                                          setFields(newFields);
                                        }}
                                        className="accent-blue-600"
                                      />
                                      <span className="text-sm">Required</span>
                                    </label>
                                    <button
                                      type="button"
                                      className="text-gray-500 hover:text-blue-600"
                                      title="Duplicate"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const duplicatedField: FormBuilderData =
                                          {
                                            ...field,
                                            id: Date.now().toString(),
                                            details: {
                                              label: field.details.label
                                                ? `${field.details.label} (Copy)`
                                                : `Question ${idx + 1} (Copy)`,
                                              options: field.details.options
                                                ? [...field.details.options]
                                                : [],
                                              hasOtherOption:
                                                field.details.hasOtherOption ||
                                                false,
                                            },
                                          };
                                        setFields([
                                          ...fields.slice(0, idx + 1),
                                          duplicatedField,
                                          ...fields.slice(idx + 1),
                                        ]);
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="lucide lucide-copy-icon lucide-copy"
                                      >
                                        <rect
                                          width="14"
                                          height="14"
                                          x="8"
                                          y="8"
                                          rx="2"
                                          ry="2"
                                        />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      className="text-gray-500 hover:text-gray-800"
                                      title="Edit"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Set the current field data for editing
                                        setNewQuestion({
                                          ...field,
                                          details: {
                                            label: field.details.label || "",
                                            options: field.details.options
                                              ? [...field.details.options]
                                              : [],
                                            hasOtherOption:
                                              field.details.hasOtherOption ||
                                              false,
                                          },
                                        });
                                        setNewQuestionType(field.type);
                                        setEditingFieldIndex(idx);
                                        setQuestionStep(2);
                                        setShowQuestionModal(true);
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        className="lucide lucide-pen-icon lucide-pen"
                                      >
                                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      className="text-gray-500 hover:text-red-600"
                                      title="Delete"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setFields(
                                          fields.filter(
                                            (f) => f.id !== field.id
                                          )
                                        );
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-x-icon lucide-x"
                                      >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                {/* Options for radio/checkbox */}
                                {(field.type === "radio" ||
                                  field.type === "checkbox") && (
                                  <div className="ml-8">
                                    {field.details?.options?.map(
                                      (opt: string, oidx: number) => (
                                        <div
                                          key={oidx}
                                          className="flex items-center mb-1"
                                        >
                                          <input
                                            type={field.type}
                                            className="mr-2"
                                            disabled
                                          />
                                          <span>
                                            {opt || `Option ${oidx + 1}`}
                                          </span>
                                          <button
                                            className="ml-2 text-gray-400 hover:text-red-500"
                                            onClick={() => {
                                              const newFields = [...fields];
                                              newFields[idx].details.options =
                                                newFields[
                                                  idx
                                                ].details.options.filter(
                                                  (_: any, i: number) =>
                                                    i !== oidx
                                                );
                                              setFields(newFields);
                                            }}
                                            disabled={
                                              field.details.options.length <= 1
                                            }
                                            title="Delete Option"
                                          >
                                            <svg
                                              width="16"
                                              height="16"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                            >
                                              <line
                                                x1="4"
                                                y1="4"
                                                x2="12"
                                                y2="12"
                                              />
                                              <line
                                                x1="12"
                                                y1="4"
                                                x2="4"
                                                y2="12"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      )
                                    )}
                                    {field.details?.hasOtherOption && (
                                      <div className="flex items-center mb-1">
                                        <input
                                          type={field.type}
                                          className="mr-2"
                                          disabled
                                        />
                                        <span className="text-gray-600 italic">
                                          Other (with text input)
                                        </span>
                                      </div>
                                    )}
                                    <button
                                      className="text-blue-600 text-sm mt-1"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const newFields = [...fields];
                                        newFields[idx].details.options = [
                                          ...newFields[idx].details.options,
                                          "Option " +
                                            (newFields[idx].details.options
                                              .length +
                                              1),
                                        ];
                                        setFields(newFields);
                                      }}
                                    >
                                      + Add Option
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-state={activeTab === "preview" ? "active" : "inactive"}
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-:r1b:-trigger-preview"
              id="radix-:r1b:-content-preview"
              tabIndex={0}
              className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
              style={{
                display: activeTab === "preview" ? "block" : "none",
              }}
            >
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 pt-6">
                  <div className="space-y-4">
                    <div
                      role="alert"
                      className="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground bg-background text-foreground"
                    >
                      <div className="text-sm [&_p]:leading-relaxed">
                        This is how your registration form will appear to
                        participants.
                      </div>
                    </div>
                    {fields.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-md text-muted-foreground">
                        No fields added yet. Add some fields in the Edit Form
                        tab to see the preview.
                      </div>
                    ) : (
                      renderPreviewForm()
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          type="button"
          onClick={handleBackToEvents}
        >
          Back to Event
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          type="button"
          onClick={() => {
            handleSaveForm();
            // handleSubmit({
            //   preventDefault: () => {},
            // } as React.FormEvent);
          }}
        >
          Save Changes
        </button>
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
                    value={newQuestion.details.label}
                    onChange={(e) =>
                      setNewQuestion((prev: any) => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          label: e.target.value,
                        },
                      }))
                    }
                  />
                  {(newQuestionType === "radio" ||
                    newQuestionType === "checkbox") && (
                    <div>
                      {newQuestion.details.options.map(
                        (opt: string, idx: number) => (
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
                                const opts = [...newQuestion.details.options];
                                opts[idx] = e.target.value;
                                setNewQuestion((prev: any) => ({
                                  ...prev,
                                  details: {
                                    ...prev.details,
                                    options: opts,
                                  },
                                }));
                              }}
                            />
                            <button
                              className="ml-2 text-red-500"
                              onClick={() => {
                                setNewQuestion((prev: any) => ({
                                  ...prev,
                                  details: {
                                    ...prev.details,
                                    options: prev.details.options.filter(
                                      (_: any, i: number) => i !== idx
                                    ),
                                  },
                                }));
                              }}
                              disabled={newQuestion.details.options.length <= 1}
                            >
                              🗑
                            </button>
                          </div>
                        )
                      )}
                      <button
                        className="text-blue-600 text-sm mt-1"
                        onClick={(e) => {
                          e.preventDefault();
                          setNewQuestion((prev: any) => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              options: [
                                ...(prev.details.options || []),
                                "Option " +
                                  ((prev.details.options?.length || 0) + 1),
                              ],
                            },
                          }));
                        }}
                      >
                        + Add Option
                      </button>
                      {/* Add "Other" option toggle for checkbox only */}
                      {newQuestionType === "checkbox" && (
                        <div className="mt-3 p-3 border rounded bg-gray-50">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={
                                newQuestion.details.hasOtherOption || false
                              }
                              onChange={(e) =>
                                setNewQuestion((prev: any) => ({
                                  ...prev,
                                  details: {
                                    ...prev.details,
                                    hasOtherOption: e.target.checked,
                                  },
                                }))
                              }
                            />
                            <span className="text-sm font-medium">
                              Add "Other" option with text input
                            </span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            This allows users to specify a custom option if none
                            of the above apply
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center mt-2">
                    <label htmlFor="question-required">
                      <input
                        type="checkbox"
                        className="mr-2"
                        name="question-required"
                        id="question-required"
                        checked={newQuestion.required || false}
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

                        const trimmedLabel = newQuestion.details.label
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
                            field.details.label.trim().toLowerCase() ===
                            trimmedLabel
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
                            { ...newQuestion, id: Date.now().toString() },
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
    </div>
  );
};

export default FormBuilder;
