import { useState } from "react";
import SharedFolderTree from "@/components/SharedFolderTree";
import { FileItem } from "@/types/vault";
import { toast } from "sonner";

const SharedFolderDemo = () => {
  const [folderId, setFolderId] = useState("");
  const [activeFolders, setActiveFolders] = useState<string[]>([]);

  const addFolder = () => {
    if (!folderId.trim()) {
      toast.error("Please enter a folder ID");
      return;
    }

    if (activeFolders.includes(folderId)) {
      toast.error("This folder is already open");
      return;
    }

    setActiveFolders([...activeFolders, folderId]);
    setFolderId("");
    toast.success("Folder added successfully");
  };

  const removeFolder = (folderIdToRemove: string) => {
    setActiveFolders(activeFolders.filter((id) => id !== folderIdToRemove));
    toast.success("Folder removed");
  };

  const handleFileClick = (file: FileItem) => {
    toast.info(`Opening file: ${file.name}`);
  };

  const handleFolderClick = () => {};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Shared Folder Tree Demo
          </h1>
          <p className="text-gray-600 mb-6">
            This demo shows how to use the SharedFolderTree component. You can
            add multiple shared folders and they will operate independently of
            each other.
          </p>

          {/* Add Folder Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add Shared Folder</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                placeholder="Enter folder ID (e.g., folder-123)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === "Enter" && addFolder()}
              />
              <button
                onClick={addFolder}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Folder
              </button>
            </div>
          </div>
        </div>

        {/* Active Folders */}
        {activeFolders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
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
              No shared folders open
            </h3>
            <p className="text-gray-500">
              Add a folder ID above to see the shared folder tree in action.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeFolders.map((activeFolderId, index) => (
              <div
                key={activeFolderId}
                className="bg-white rounded-lg shadow-sm border"
              >
                <div className="border-b px-6 py-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Shared Folder {index + 1}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {activeFolderId}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFolder(activeFolderId)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200 hover:border-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <SharedFolderTree
                  folderId={activeFolderId}
                  onFileClick={(file) => handleFileClick(file)}
                  onFolderClick={() => handleFolderClick()}
                  showFileActions={true}
                  allowDownload={true}
                  title="Shared Content"
                />
              </div>
            ))}
          </div>
        )}

        {/* Usage Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            How to use SharedFolderTree
          </h3>
          <div className="space-y-3 text-blue-800 text-sm">
            <p>
              <strong>Independent Operation:</strong> Each folder tree operates
              independently with its own navigation state.
            </p>
            <p>
              <strong>Custom Handlers:</strong> You can provide custom onClick
              handlers for files and folders.
            </p>
            <p>
              <strong>Configurable:</strong> Control file actions, download
              permissions, and styling with props.
            </p>
            <p>
              <strong>Error Handling:</strong> Built-in error handling with
              retry functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedFolderDemo;
