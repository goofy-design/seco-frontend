import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import axiosInstance from "../utils/axios";
import API_CONSTANTS from "@/utils/apiConstants";
import { toast } from "sonner";

interface Judge {
  id: string;
  name: string;
  email: string;
  expertise: string[] | null;
  event_id: string | null;
}

interface Participant {
  id: string;
  user_id: string;
  judge_id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  currentJudge?: {
    id: string;
    name: string;
    email: string;
  };
  reassignJudge?: {
    id: string;
    name: string;
    email: string;
  };
  applied_date: string;
  status: string;
}
interface ReviewAssignmentsModalProps {
  closeModal: () => void;
  judge: Judge[];
  eventId: string;
  filterByJudge?: boolean;
  judgeId?: string; // Optional prop to filter by specific judge
}

const ReviewAssignmentsModal: React.FC<ReviewAssignmentsModalProps> = ({
  closeModal,
  judge,
  eventId,
  filterByJudge = false,
  judgeId,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchModifiedJudgeData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          API_CONSTANTS.GET_MODIFIED_JUDGE(eventId)
        );
        const mappedParticipants = response.data.applications.map(
          (app: any) => {
            // Find the current judge assigned to this participant
            const currentJudge = judge.find(
              (j) => j.id === app.judge_id || j.name === app.judge_name
            );

            return {
              ...app,
              currentJudge: currentJudge
                ? {
                    id: currentJudge.id,
                    name: currentJudge.name,
                    email: currentJudge.email,
                  }
                : undefined,
              reassignJudge: currentJudge
                ? {
                    id: currentJudge.id,
                    name: currentJudge.name,
                    email: currentJudge.email,
                  }
                : undefined,
              applicationId: app.applicationId || app.id,
            };
          }
        );
        let finalParticipants = mappedParticipants;
        if (filterByJudge) {
          finalParticipants = mappedParticipants.filter(
            (participant: any) => participant.currentJudge?.id === judgeId
          );
        }
        setParticipants(finalParticipants);
      } catch (error) {
        console.error("Error fetching modified judge data:", error);
        setIsError("Failed to fetch participants.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModifiedJudgeData();
  }, [judge, eventId]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Only include participants where reassign judge is different from current judge
      const updatedParticipants = participants
        .filter((participant) => {
          const hasReassignJudge = participant.reassignJudge?.id;
          const isDifferentFromCurrent =
            participant.reassignJudge?.id !== participant.currentJudge?.id;
          return hasReassignJudge && isDifferentFromCurrent;
        })
        .map((participant) => ({
          judgeId: participant.reassignJudge?.id,
          applicationId: participant.id,
        }));

      if (updatedParticipants.length === 0) {
        toast.info("No changes to save");
        setIsSaving(false);
        return;
      }

      const payload = {
        eventId,
        updatedParticipants,
      };

      const response = await axiosInstance.put(
        API_CONSTANTS.UPDATE_MODIFIED_JUDGE(eventId),
        payload
      );

      if (response.status === 200) {
        toast.success("Judge assignments have been updated");
        closeModal();
      } else {
        console.error("Failed to save changes:", response);
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Review & Modify Assignments</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                    Participant
                  </th>
                  {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                    Category
                  </th> */}
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                    Current Judge
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                    Reassign To
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="text-gray-500">Loading...</div>
                    </td>
                  </tr>
                ) : isSaving ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="text-blue-500">Saving changes...</div>
                    </td>
                  </tr>
                ) : (
                  participants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {participant.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Applied on:{" "}
                          {new Date(
                            participant.applied_date
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          {new Date(
                            participant.applied_date
                          ).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {participant.currentJudge?.name || "Not assigned yet"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className={`px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            participant.reassignJudge?.id !==
                              participant.currentJudge?.id &&
                            participant.reassignJudge?.id
                              ? "border-orange-300 bg-orange-50"
                              : "border-gray-300"
                          }`}
                          value={participant.reassignJudge?.id || ""}
                          onChange={(e) => {
                            const selectedJudgeId = e.target.value;
                            const selectedJudge = judge.find(
                              (j) => j.id === selectedJudgeId
                            );
                            setParticipants((prev) =>
                              prev.map((p) =>
                                p.id === participant.id
                                  ? {
                                      ...p,
                                      reassignJudge: selectedJudge
                                        ? {
                                            id: selectedJudge.id,
                                            name: selectedJudge.name,
                                            email: selectedJudge.email,
                                          }
                                        : undefined,
                                    }
                                  : p
                              )
                            );
                          }}
                          disabled={
                            isSaving || participant.status === "Accepted"
                          }
                        >
                          <option value="">Select Judge</option>
                          {judge.map((j) => (
                            <option key={j.id} value={j.id}>
                              {j.name}
                            </option>
                          ))}
                        </select>
                        {participant.reassignJudge?.id !==
                          participant.currentJudge?.id &&
                          participant.reassignJudge?.id && (
                            <div className="text-xs text-orange-600 mt-1">
                              Will be reassigned
                            </div>
                          )}
                      </td>
                    </tr>
                  ))
                )}
                {isError && (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="text-red-500">{isError}</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end pt-6">
            <button
              onClick={handleSaveChanges}
              disabled={
                isSaving ||
                !participants.some(
                  (p) =>
                    p.reassignJudge?.id &&
                    p.reassignJudge?.id !== p.currentJudge?.id
                )
              }
              className={`px-4 py-2 rounded-md ${
                isSaving ||
                !participants.some(
                  (p) =>
                    p.reassignJudge?.id &&
                    p.reassignJudge?.id !== p.currentJudge?.id
                )
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAssignmentsModal;
