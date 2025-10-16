import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import axiosInstance from "@/utils/axios";
import API_CONSTANTS from "@/utils/apiConstants";
import { EventInterface } from "@/types/event";
import OverallInsights from "./OverallInsights";
import CreateEvent from "./CreateEvent";
import Participants from "./Participants";
import JudgeManagementSystem from "./JudgeManagementSystem";
import SendUpdateModal from "@/components/SendUpdateModal";
import { toast } from "sonner";

const ManageEvent: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("insight");
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<EventInterface>({});
  const { id: eventIdFromParam } = useParams();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const preFillData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_EVENT_BY_ID(eventIdFromParam!)
      );
      const data = response.data;
      setEventData(data.event);
    } catch (error) {
      console.error("Error fetching event data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/event/view/${eventIdFromParam}`)
      .then(() => {
        toast.success("Event link copied to clipboard!");
      });
  };
  const closeModal = () => {
    setActiveModal(null);
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
    <div
      className="flex flex-col gap-4 overflow-hidden"
      style={{ height: "calc(100vh - 140px)" }}
    >
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10"
            onClick={() => navigate("/my-events")}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {/* </a> */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-3 items-center">
              <h1 className="text-2xl font-bold tracking-tight">
                {eventData.title}
              </h1>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800">
                Published
              </div>
              <div
                className="flex items-center gap-2 bg-white rounded-sm p-2 px-4 border border-gray-200 cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-share"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" x2="12" y1="2" y2="15"></line>
                </svg>
                <span>Share</span>
              </div>
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                      onClick={() => setShowModal(false)}
                    >
                      &times;
                    </button>
                    <h3 className="text-lg font-semibold mb-4">
                      Share this event
                    </h3>
                    <div className="bg-gray-100 px-3 py-2 rounded mb-4 overflow-auto">
                      <span className="text-sm break-all">{`${window.location.origin}/event/view/${eventIdFromParam}`}</span>
                    </div>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={handleCopy}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* <p className="text-muted-foreground">
              {eventData.location_name ? (
                <>
                  Location:{" "}
                  {eventData.location_name}
                </>
              ) : null}
            </p> */}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal("sendUpdate")}
            className="flex items-center gap-2 px-4 py-2 text-white bg-black rounded-md border border-gray-200"
          >
            <Send size={18} /> Send Update
          </button>
          <div className="flex items-center space-x-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              Admin User
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex w-full bg-gray-100 p-1 rounded-xs flex-shrink-0"
        role="tablist"
      >
        <button
          onClick={() => setActiveTab("insight")}
          className={`flex-1 px-4 py-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "insight"
              ? "text-black bg-white rounded-sm"
              : "border-transparent text-gray-500 hover:text-gray-700 bg-gray-100"
          }`}
        >
          Overall Insight
        </button>
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 px-4 py-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "edit"
              ? "text-black bg-white rounded-sm"
              : "border-transparent text-gray-500 hover:text-gray-700 bg-gray-100"
          }`}
        >
          Edit Event
        </button>
        <button
          onClick={() => setActiveTab("participants")}
          className={`flex-1 px-4 py-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "participants"
              ? "text-black bg-white rounded-sm"
              : "border-transparent text-gray-500 hover:text-gray-700 bg-gray-100"
          }`}
        >
          Participants
        </button>
        <button
          onClick={() => setActiveTab("judges")}
          className={`flex-1 px-4 py-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "judges"
              ? "text-black bg-white rounded-sm"
              : "border-transparent text-gray-500 hover:text-gray-700 bg-gray-100"
          }`}
        >
          Judge Management
        </button>
      </div>

      {/* this div should have inside scroll above divs should be static it should not scroll */}
      <div className="overflow-y-auto flex-1">
        {activeTab === "insight" && <OverallInsights eventData={eventData} />}
        {activeTab === "edit" && <CreateEvent />}
        {activeTab === "participants" && <Participants eventData={eventData} />}
        {activeTab === "judges" && (
          <JudgeManagementSystem eventData={eventData} />
        )}
        {activeModal === "sendUpdate" && (
          <SendUpdateModal
            closeModal={closeModal}
            eventId={eventIdFromParam!}
          />
        )}
      </div>
    </div>
  );
};

export default ManageEvent;
