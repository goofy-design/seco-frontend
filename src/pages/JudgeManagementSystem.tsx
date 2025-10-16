import { useEffect, useState, useRef, useCallback } from "react";
import {
  Users,
  UserCheck,
  User,
  Plus,
  ClipboardList,
  CheckCircle,
  Bell,
  FileText,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";
import { EventInterface } from "@/types/event";
import ReviewAssignmentsModal from "@/components/ReviewAssignmentsModal";
import AssignParticipantsModal from "@/components/AssignParticipantsModal";
import AddJudgeModal from "@/components/AddJudgeModal";
import EvaluationCriteriaModal from "@/components/EvaluationCriteriaModal";
import NotifyJudgeModal from "@/components/NotifyJudgeModal";
import { useParams } from "react-router-dom";
import API_CONSTANTS from "@/utils/apiConstants";

export interface Judge {
  id: string;
  name: string;
  email: string;
  expertise: string[] | null;
  event_id: string | null;
  user: {
    id: string;
    applied_date: string;
    status: string;
    judge_comment: string;
    judge_id: string;
    event_id: string;
    user_id: string;
    final_score: number;
    review_date: string;
    evaluation_scores: Record<string, number>;
    userData: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

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

interface JudgeManagementSystemProps {
  eventData?: EventInterface;
}

const JudgeManagementSystem: React.FC<JudgeManagementSystemProps> = ({
  eventData,
}) => {
  const { id: eventId } = useParams<{ id: string }>();
  const [currentJudgeId, setCurrentJudgeId] = useState<string | null>(null);
  const [judge, setJudge] = useState<Judge[]>([]);
  const [assignedParticipants, setAssignedParticipants] = useState<number>(0);
  const [completedReviews, setCompletedReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({});
  const [editingJudgeId, setEditingJudgeId] = useState<string | null>(null);
  const [judgesCount, setJudgesCount] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    expertise: [],
    category: "All Categories",
    assignmentMethod: "Random",
    batchSize: 5,
    balanceWorkload: true,
    allowSelfAssign: false,
    sendTo: "All Recipients",
    priority: "Normal",
    subject: "",
    message: "",
    status: "",
  });

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const count = judge.reduce(
      (acc, ele) => acc + (ele.user.length > 0 ? 1 : 0),
      0
    );
    setJudgesCount(count);

    const completed = judge.reduce(
      (acc, ele) => acc + ele.user.filter((u) => u.final_score !== null).length,
      0
    );
    setCompletedReviews(completed);

    const assigned = judge.reduce((acc, ele) => acc + ele.user.length, 0);
    setAssignedParticipants(assigned);
  }, [judge]);

  // Handle modal backdrop click and dropdown close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setActiveModal(null);
        setDropdowns({});
      }
      const dropdownElements = document.querySelectorAll("[data-dropdown]");
      let clickedInDropdown = false;
      dropdownElements.forEach((el) => {
        if (el.contains(event.target as Node)) {
          clickedInDropdown = true;
        }
      });
      if (!clickedInDropdown && Object.values(dropdowns).some(Boolean)) {
        setDropdowns({});
      }
    };

    const hasActiveModal = activeModal !== null;
    const hasOpenDropdowns = Object.values(dropdowns).some(Boolean);

    if (hasActiveModal || hasOpenDropdowns) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = hasActiveModal ? "hidden" : "unset";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [activeModal, dropdowns]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModal(null);
        setDropdowns({});
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  const fetchJudges = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/judge/get-all-judges/${eventId}`);
      let data = res?.data?.data;
      if (!Array.isArray(data)) {
        data = [];
      }
      setJudge(data);
    } catch (error: any) {
      setError("Failed to fetch judge data");
      toast.error("Failed to fetch judge data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJudges();
  }, []);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
    setDropdowns({});
    setFormData({
      name: "",
      email: "",
      expertise: [],
      category: "All Categories",
      assignmentMethod: "Random",
      batchSize: 5,
      balanceWorkload: true,
      allowSelfAssign: false,
      sendTo: "All Recipients",
      priority: "Normal",
      subject: "",
      message: "",
      status: "",
    });
  };

  const closeModal = () => {
    setActiveModal(null);
    setDropdowns({});
    setCurrentJudgeId(null);
    fetchJudges();
  };

  const toggleDropdown = (key: string) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleExpertiseToggle = useCallback((expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter((e) => e !== expertise)
        : [...prev.expertise, expertise],
    }));
  }, []);

  const handleSendNotifications = async () => {
    setLoading(true);
    try {
      const result = await axiosInstance.get(
        API_CONSTANTS.SEND_NOTIFICATION_TO_JUDGE(eventId || "")
      );
      if (result?.data?.success) {
        toast.success("Notification sent to judge!");
        closeModal();
      } else {
        toast.error("Failed to send notification.");
      }
    } catch (error) {
      toast.error("An error occurred while sending notification.");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put(`/judge/update-judge/${eventId}`, formData);
    } catch (error: any) {
      setError("Failed to submit form");
      console.error(
        "Error submitting form:",
        error.response?.data.error || error.message
      );
      toast.error(error.response?.data.error || "Failed to submit form");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-lg font-semibold">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <div className="text-gray-500">Please try again later.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Judge Management</h2>
      </div>
      <div className="flex flex-wrap gap-3 mb-8 justify-between">
        <button
          onClick={() => openModal("addJudge")}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200"
        >
          <Plus size={18} /> Add Judge
        </button>
        <button
          onClick={() => openModal("assignParticipants")}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200"
        >
          <UserCheck size={18} /> Assign Participants
        </button>
        <button
          onClick={() => openModal("reviewAssignments")}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200"
        >
          <ClipboardList size={18} /> Review Assignments
        </button>
        <button
          onClick={() => openModal("evaluationCriteria")}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200"
        >
          <FileText size={18} /> Evaluation Criteria
        </button>
        <button
          onClick={() => openModal("notifyJudge")}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200"
        >
          <Bell size={18} /> Notify Judge
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-10">
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
          <User className="text-blue-600" size={32} />
          <div>
            <div className="text-2xl font-bold">{judge.length}</div>
            <div className="text-gray-600">Total Judges</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
          <Users className="text-green-600" size={32} />
          <div>
            <div className="text-2xl font-bold">{assignedParticipants}</div>
            <div className="text-gray-600">Assigned Participants</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
          <CheckCircle className="text-yellow-500" size={32} />
          <div>
            <div className="text-2xl font-bold">{completedReviews}</div>
            <div className="text-gray-600">Completed Reviews</div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mx-auto">
        <h3 className="text-2xl font-semibold text-center mb-4">Judges</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Judge
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Expertise
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                  Assigned
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                  Completed
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                  View Assigned
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {judge.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No judges found.
                  </td>
                </tr>
              ) : (
                judge.map((jud) => {
                  const expertise = jud.expertise || [];
                  return (
                    <tr
                      key={jud.id}
                      className="bg-white border-b rounded-lg shadow-sm"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {jud.name}
                        </div>
                        <div className="text-sm text-gray-500">{jud.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {expertise.map((exp, i) => (
                            <span
                              key={i}
                              className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold border border-gray-200"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-base">
                        {jud.user.length}
                      </td>
                      <td className="px-6 py-4 text-center text-base">
                        {jud.user.filter((u) => u.final_score !== null).length}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="inline-flex items-center gap-1 text-gray-700 hover:text-blue-700 font-medium"
                          onClick={() => {
                            setCurrentJudgeId(jud.id);
                            setActiveModal(`viewAssigned-${jud.id}`);
                          }}
                        >
                          <Users size={16} /> View Assigned ({jud.user.length})
                        </button>
                        {activeModal === `viewAssigned-${jud.id}` &&
                          currentJudgeId && (
                            <ReviewAssignmentsModal
                              closeModal={closeModal}
                              judge={judge}
                              eventId={eventData?.id ?? ""}
                              filterByJudge={true}
                              judgeId={currentJudgeId}
                            />
                          )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="inline-flex items-center text-gray-500 hover:text-gray-800"
                          title="Edit"
                          onClick={() => {
                            setActiveModal("editJudge");
                            setFormData({
                              ...formData,
                              name: jud.name,
                              email: jud.email,
                              expertise: jud.expertise || [],
                            });
                            setEditingJudgeId(jud.id);
                          }}
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {activeModal === "addJudge" && (
        <AddJudgeModal
          eventData={eventData}
          closeModal={closeModal}
          fetchJudges={fetchJudges}
          formData={formData}
          handleInputChange={handleInputChange}
          toggleDropdown={toggleDropdown}
          dropdowns={dropdowns}
          handleExpertiseToggle={handleExpertiseToggle}
        />
      )}
      {activeModal === "editJudge" && (
        <AddJudgeModal
          eventData={eventData}
          closeModal={closeModal}
          fetchJudges={fetchJudges}
          formData={formData}
          handleInputChange={handleInputChange}
          toggleDropdown={toggleDropdown}
          dropdowns={dropdowns}
          handleExpertiseToggle={handleExpertiseToggle}
          isEditing={true}
          judgeId={editingJudgeId}
        />
      )}
      {activeModal === "assignParticipants" && (
        <AssignParticipantsModal
          closeModal={closeModal}
          formData={formData}
          handleInputChange={handleInputChange}
          toggleDropdown={toggleDropdown}
          dropdowns={dropdowns}
          handleSubmit={handleSubmit}
          eventData={eventData}
        />
      )}
      {activeModal === "reviewAssignments" && !currentJudgeId && (
        <ReviewAssignmentsModal
          closeModal={closeModal}
          judge={judge}
          eventId={eventData?.id ?? ""}
        />
      )}
      {activeModal === "evaluationCriteria" && (
        <EvaluationCriteriaModal
          closeModal={closeModal}
          eventId={eventData?.id ?? ""}
        />
      )}
      {activeModal === "notifyJudge" && (
        <NotifyJudgeModal
          closeModal={closeModal}
          judgesCount={judgesCount}
          handleSendNotifications={handleSendNotifications}
          eventName={eventData?.title || "Event"}
        />
      )}
    </div>
  );
};

export default JudgeManagementSystem;
