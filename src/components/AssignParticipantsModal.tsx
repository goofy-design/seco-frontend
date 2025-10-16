import { useRef } from "react";
import { X, ChevronDown } from "lucide-react";
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
  status: string;
}

const mockCategories = [
  "All Categories",
  "AI/ML",
  "Web Development",
  "Mobile Apps",
  "Hardware",
];

interface AssignParticipantsModalProps {
  closeModal: () => void;
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  toggleDropdown: (key: string) => void;
  dropdowns: Record<string, boolean>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  eventData?: EventInterface;
}

const AssignParticipantsModal: React.FC<AssignParticipantsModalProps> = ({
  closeModal,
  formData,
  handleInputChange,
  toggleDropdown,
  dropdowns,
  handleSubmit,
  eventData,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            Assign Participants to Judges
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Method
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                onClick={() => toggleDropdown("method")}
              >
                <span>{formData.assignmentMethod}</span>
                <ChevronDown size={20} />
              </button>
              {dropdowns.method && (
                <div
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                  data-dropdown
                >
                  {["By Category & Expertise", "Random"].map((method) => (
                    <div
                      key={method}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        handleInputChange("assignmentMethod", method);
                        toggleDropdown("method");
                      }}
                    >
                      {method}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Category
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                onClick={() => toggleDropdown("category")}
              >
                <span>{formData.category}</span>
                <ChevronDown size={20} />
              </button>
              {dropdowns.category && (
                <div
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                  data-dropdown
                >
                  {mockCategories.map((cat) => (
                    <div
                      key={cat}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        handleInputChange("category", cat);
                        toggleDropdown("category");
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Size (participants per judge)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.batchSize}
              onChange={(e) =>
                handleInputChange("batchSize", parseInt(e.target.value))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select Status
              </option>
              {eventData?.statuses?.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
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
              Assign Participants
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignParticipantsModal;
