import React from "react";
import SharedFolderTree from "@/components/SharedFolderTree";

interface SharedFoldersViewProps {
  sharedFolderIds: string[];
}

const SharedFoldersView: React.FC<SharedFoldersViewProps> = ({
  sharedFolderIds,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {sharedFolderIds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto h-16 w-16"
              >
                <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No shared folders
            </h3>
            <p className="text-gray-500">
              You don't have access to any shared folders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sharedFolderIds.map((folderId, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border">
                <SharedFolderTree
                  folderId={folderId}
                  className="min-h-[400px]"
                  showFileActions={true}
                  allowDownload={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedFoldersView;
