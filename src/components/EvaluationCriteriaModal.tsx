import { useRef, useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";
import API_CONSTANTS from "@/utils/apiConstants";

interface Criterion {
  id: string;
  name: string;
  weight: number;
  desc: string;
}

interface EvaluationCriteriaModalProps {
  closeModal: () => void;
  eventId: string;
}

const EvaluationCriteriaModal: React.FC<EvaluationCriteriaModalProps> = ({
  closeModal,
  eventId,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCriteria = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          API_CONSTANTS.SHOW_CRITERIA(eventId)
        );
        const fetchedCriteria = response?.data?.evaluationCriteria;
        if (fetchedCriteria && fetchedCriteria.length > 0) {
          setCriteria(
            fetchedCriteria.map((item: any) => ({
              id: Date.now().toString() + Math.random(),
              name: item.name || "",
              weight: item.weight || 0,
              desc: item.description || "",
            }))
          );
        } else {
          setCriteria([
            { id: Date.now().toString(), name: "", weight: 0, desc: "" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching criteria:", error);
        toast.error("Failed to load criteria");
        setCriteria([
          { id: Date.now().toString(), name: "", weight: 0, desc: "" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCriteria();
  }, [eventId]);

  const totalWeight = criteria.reduce(
    (sum, criterion) => sum + (criterion.weight || 0),
    0
  );
  const handleInputChange = (
    id: string,
    field: keyof Criterion,
    value: string | number
  ) => {
    setCriteria((prev) =>
      prev.map((criterion) =>
        criterion.id === id ? { ...criterion, [field]: value } : criterion
      )
    );
  };

  const handleAddCriterion = () => {
    setCriteria((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", weight: 0, desc: "" },
    ]);
  };

  const handleDeleteCriterion = (id: string) => {
    setCriteria((prev) => prev.filter((criterion) => criterion.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasEmptyName = criteria.some((criterion) => !criterion.name.trim());
    if (hasEmptyName) {
      toast.error("Please enter a name for all criteria");
      return;
    }

    if (totalWeight < 100) {
      toast.error("Total weight should not be less than 100%");
      return;
    }

    if (totalWeight > 100) {
      toast.error("Total weight should not be more than 100%");
      return;
    }

    setIsLoading(true);
    try {
      const payload = criteria.map((criterion) => ({
        name: criterion.name,
        weight: criterion.weight,
        description: criterion.desc || null,
      }));
      await axiosInstance.put(API_CONSTANTS.UPDATE_CRITERIA(eventId), payload);
      toast.success("Criteria saved successfully");
      closeModal();
    } catch (error) {
      console.error("Error saving criteria:", error);
      toast.error("Failed to save criteria");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Evaluation Criteria</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 mb-6">
            Configure the evaluation criteria that judges will use to score
            participants. Total weights must equal 100%.
          </p>
          {isLoading ? (
            <p>Loading criteria...</p>
          ) : (
            <div className="space-y-4">
              {criteria.map((criterion) => (
                <div
                  key={criterion.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Criterion Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={criterion.name}
                        onChange={(e) =>
                          handleInputChange(
                            criterion.id,
                            "name",
                            e.target.value
                          )
                        }
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (%)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={criterion.weight || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 1 && value <= 100) {
                            handleInputChange(criterion.id, "weight", value);
                          } else if (e.target.value === "") {
                            handleInputChange(criterion.id, "weight", 0);
                          }
                        }}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      type="button"
                      className="mt-6 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteCriterion(criterion.id)}
                      disabled={isLoading || criteria.length === 1}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      value={criterion.desc}
                      onChange={(e) =>
                        handleInputChange(criterion.id, "desc", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <button
              type="button"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50"
              onClick={handleAddCriterion}
              disabled={isLoading}
            >
              + Add Criterion
            </button>
            <span className="font-medium text-gray-700">
              Total Weight: {totalWeight}%
            </span>
          </div>
          <div className="flex justify-end gap-3 mt-6">
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
              Save Criteria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationCriteriaModal;
