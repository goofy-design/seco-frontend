import { useCallback, useRef, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  expertise: string[];
  category: string;
  assignmentMethod: string;
  batchSize: number;
  balanceWorkload: boolean;
  allowSelfAssign: boolean;
  sendTo: string;
  priority: string;
  subject: string;
  message: string;
}

interface SendUpdateModalProps {
  closeModal: () => void;
  eventId: string;
}

const SendUpdateModal: React.FC<SendUpdateModalProps> = ({
  closeModal,
  eventId,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    expertise: [],
    category: "",
    assignmentMethod: "Auto Assign",
    batchSize: 1,
    balanceWorkload: false,
    allowSelfAssign: false,
    sendTo: "All Recipients",
    priority: "Normal",
    subject: "",
    message: "",
  });

  const handleSendUpdateSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post(`/mail//send-update-email/${eventId}`, formData);
      toast.success("Update sent successfully");
    } catch (error: any) {
      console.error(
        "Error sending update:",
        error.response?.data.error || error.message
      );
      toast.error(error.response?.data.error || "Failed to send update");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleInputChange = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const toggleDropdown = (key: string) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  // Determine the preview recipient text based on sendTo value
  const getPreviewRecipient = () => {
    if (formData.sendTo === "Judges Only") return "To: Event judges";
    if (formData.sendTo === "Participants Only")
      return "To: Event participants";
    return "To: All event participants and judges";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">
              Send Update to Event Community
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Send important updates, announcements or changes...
            </p>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSendUpdateSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send To
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                  onClick={() => toggleDropdown("sendTo")}
                >
                  <span>{formData.sendTo}</span>
                  <ChevronDown size={20} />
                </button>
                {dropdowns.sendTo && (
                  <div
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                    data-dropdown
                  >
                    {["All Recipients", "Participants Only", "Judges Only"].map(
                      (option) => (
                        <div
                          key={option}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            handleInputChange("sendTo", option);
                            toggleDropdown("sendTo");
                          }}
                        >
                          {option}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                  onClick={() => toggleDropdown("priority")}
                >
                  <span>{formData.priority}</span>
                  <ChevronDown size={20} />
                </button>
                {dropdowns.priority && (
                  <div
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                    data-dropdown
                  >
                    {["Normal", "High Priority", "Urgent"].map((option) => (
                      <div
                        key={option}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          handleInputChange("priority", option);
                          toggleDropdown("priority");
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Update subject line..."
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Type your update message here..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[120px] overflow-y-auto"
              style={{ maxHeight: "200px" }}
            >
              <div className="text-gray-800">
                <div className="mb-1">
                  <span className="font-semibold text-gray-900">To:&nbsp;</span>
                  <span className="text-gray-600">
                    {getPreviewRecipient().replace("To: ", "")}
                  </span>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-gray-900">
                    Subject:&nbsp;
                  </span>
                  <span className="text-gray-600">
                    {formData.subject || ""}
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-gray-700">
                  {formData.message || "No message to preview"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              Send Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendUpdateModal;
