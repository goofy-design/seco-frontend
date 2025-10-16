import { useRef } from "react";
import { X } from "lucide-react";

interface NotifyJudgeModalProps {
  closeModal: () => void;
  judgesCount: number;
  handleSendNotifications: () => Promise<void>;
  eventName: string;
}

const NotifyJudgeModal: React.FC<NotifyJudgeModalProps> = ({
  closeModal,
  judgesCount,
  handleSendNotifications,
  eventName,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Send Judge Notifications</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">
              Notification Details:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Unique evaluation links for each judge</li>
              <li>• List of assigned participants</li>
              <li>• Evaluation criteria and scoring guidelines</li>
              <li>• Submission deadline and instructions</li>
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">
              Preview Email Content:
            </h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="font-semibold text-gray-900 mb-2">
                Subject: New Evaluation Assignment - {eventName}
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                <p>Dear Judge,</p>
                <p>
                  You have been assigned participants to evaluate for the
                  {" " + eventName} event. Please use the following link to
                  access your evaluation panel:
                </p>
                <p className="text-blue-600 underline">
                  https://getseco.com/judge/event-101
                </p>
                <p>
                  Your assigned participants and evaluation criteria are
                  available in the panel.
                </p>
                <p>Thank you for your participation!</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Judges to notify:{" "}
              <span className="font-medium">{judgesCount} judges</span>
            </span>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                onClick={handleSendNotifications}
              >
                Send Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifyJudgeModal;
