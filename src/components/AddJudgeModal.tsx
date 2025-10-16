import { useRef, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";
import API_CONSTANTS from "@/utils/apiConstants";
import { EventInterface } from "@/types/event";

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

interface AddJudgeModalProps {
  eventData?: EventInterface;
  closeModal: () => void;
  fetchJudges: () => Promise<void>;
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  toggleDropdown: (key: string) => void;
  dropdowns: Record<string, boolean>;
  handleExpertiseToggle: (expertise: string) => void;
  isEditing?: boolean;
  judgeId?: string | null;
}

const mockExpertise = ["AI/ML", "Web Development", "Mobile Apps", "Hardware"];

const AddJudgeModal: React.FC<AddJudgeModalProps> = ({
  eventData,
  closeModal,
  fetchJudges,
  formData,
  handleInputChange,
  toggleDropdown,
  dropdowns,
  handleExpertiseToggle,
  isEditing = false,
  judgeId,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        event_id: eventData?.id || null,
        email: formData.email,
        expertise: formData.expertise,
      };
      if (isEditing && judgeId) {
        await axiosInstance.put(API_CONSTANTS.EDIT_JUDGE(judgeId), payload);
        toast.success("Judge updated successfully");
      } else {
        await axiosInstance.post(API_CONSTANTS.ADD_JUDGE, payload);
        toast.success("Judge added successfully");
      }
      await fetchJudges();
      closeModal();
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "adding"} judge:`, error);
      toast.error(`Failed to ${isEditing ? "update" : "add"} judge`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Judge" : "Add New Judge"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Judge's full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="judge@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expertise Areas
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                onClick={() => toggleDropdown("expertise")}
                disabled={isLoading}
              >
                <span className="truncate">
                  {formData.expertise.length > 0
                    ? formData.expertise.join(", ")
                    : "Select expertise areas"}
                </span>
                <ChevronDown size={20} />
              </button>
              {dropdowns.expertise && (
                <div
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  data-dropdown
                >
                  {mockExpertise.map((exp) => (
                    <div
                      key={exp}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                      onClick={() => handleExpertiseToggle(exp)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.expertise.includes(exp)}
                        readOnly
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              disabled={isLoading}
            >
              {isEditing ? "Update Judge" : "Add Judge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJudgeModal;
