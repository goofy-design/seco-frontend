import React, { useState } from "react";
import { Folder, File, Plus, Minus } from "lucide-react";

interface FolderTreeProps {
  folder: any;
  selectedFolders: string[];
  selectedFiles: string[];
  onFolderSelect: (folder: any, isChecked: boolean) => void;
  onFileSelect: (fileId: string, isChecked: boolean) => void;
  level?: number;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  folder,
  selectedFolders,
  selectedFiles,
  onFolderSelect,
  onFileSelect,
  level = 0,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const toggleFolderExpansion = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const getAllSubFolders = (folder: any): string[] => {
    let folderIds: string[] = [];

    if (folder.children) {
      folder.children.forEach((child: any) => {
        folderIds.push(child.id);
        folderIds = [...folderIds, ...getAllSubFolders(child)];
      });
    }

    return folderIds;
  };

  const getAllFilesInFolder = (folder: any): string[] => {
    let fileIds: string[] = [];

    if (folder.files) {
      fileIds = [...fileIds, ...folder.files.map((file: any) => file.id)];
    }

    if (folder.children) {
      folder.children.forEach((child: any) => {
        fileIds = [...fileIds, ...getAllFilesInFolder(child)];
      });
    }

    return fileIds;
  };

  const getAllFiles = (folder: any) => {
    let allFiles: Array<{
      id: string;
      name: string;
      size: number;
      file_type: string;
    }> = [];

    if (folder?.files) {
      allFiles = [...allFiles, ...folder.files];
    }

    if (folder?.children) {
      folder.children.forEach((child: any) => {
        allFiles = [...allFiles, ...getAllFiles(child)];
      });
    }
    return allFiles;
  };

  const handleFolderSelect = (folder: any, isChecked: boolean) => {
    onFolderSelect(folder, isChecked);
  };

  const isFolderSelected = (folder: any) => {
    return selectedFolders.includes(folder.id);
  };

  const isFileSelected = (fileId: string) => {
    return selectedFiles.includes(fileId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <File className="w-4 h-4 text-green-500" />;
    } else if (fileType.includes("pdf")) {
      return <File className="w-4 h-4 text-red-500" />;
    } else if (fileType.includes("document") || fileType.includes("word")) {
      return <File className="w-4 h-4 text-blue-500" />;
    }
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const isExpanded = expandedFolders.includes(folder.id);
  const isSelected = isFolderSelected(folder);
  const hasChildren = folder.children && folder.children.length > 0;
  const hasFiles = folder.files && folder.files.length > 0;

  return (
    <div key={folder.id} className="space-y-1">
      <div
        className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50`}
        style={{ marginLeft: level * 20 }}
      >
        <button
          onClick={() => toggleFolderExpansion(folder.id)}
          className="p-1 hover:bg-gray-200 rounded flex items-center justify-center w-6 h-6"
          disabled={!hasChildren && !hasFiles}
        >
          {hasChildren || hasFiles ? (
            isExpanded ? (
              <Minus className="w-3 h-3 text-gray-600" />
            ) : (
              <Plus className="w-3 h-3 text-gray-600" />
            )
          ) : (
            <div className="w-3 h-3" />
          )}
        </button>

        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => handleFolderSelect(folder, e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />

        <Folder className="w-4 h-4 text-blue-500" />

        <span className="text-sm font-medium text-gray-700">
          {folder.name}
        </span>

        <span className="text-xs text-gray-500">
          (
          {(folder.files?.length || 0) +
            getAllFiles(folder).length -
            (folder.files?.length || 0)}{" "}
          files)
        </span>
      </div>

      {isExpanded && (
        <div className="space-y-1">
          {folder.files &&
            folder.files.map((file: any) => (
              <div
                key={file.id}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50"
                style={{ marginLeft: (level + 1) * 20 }}
              >
                <div className="w-6 h-6" />
                <input
                  type="checkbox"
                  checked={isFileSelected(file.id)}
                  onChange={(e) =>
                    onFileSelect(file.id, e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                {getFileIcon(file.file_type)}
                <span className="text-sm text-gray-600">{file.name}</span>
                <span className="text-xs text-gray-400">
                  ({formatFileSize(file.size)})
                </span>
              </div>
            ))}

          {folder.children &&
            folder.children.map((child: any) => (
              <FolderTree
                key={child.id}
                folder={child}
                selectedFolders={selectedFolders}
                selectedFiles={selectedFiles}
                onFolderSelect={onFolderSelect}
                onFileSelect={onFileSelect}
                level={level + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default FolderTree;
