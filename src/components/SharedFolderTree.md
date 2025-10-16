# SharedFolderTree Component

A reusable React component for navigating shared folder structures, similar to Google Drive. This component allows users to browse through a folder tree hierarchy and access files within shared folders.

## Features

- **Independent Operation**: Multiple instances can run in parallel without interfering with each other
- **Complete Navigation**: Full folder tree navigation with breadcrumb support
- **File Management**: View, download, and interact with files
- **Error Handling**: Built-in error handling with retry functionality
- **Customizable**: Configurable actions, permissions, and styling
- **Loading States**: Proper loading and error states for better UX

## Installation

The component is already included in your project at `/src/components/SharedFolderTree.tsx`.

## Basic Usage

```tsx
import SharedFolderTree from "@/components/SharedFolderTree";

function MyComponent() {
  return (
    <SharedFolderTree
      folderId="folder-123"
      onFileClick={(file) => console.log("File clicked:", file)}
      onFolderClick={(folder) => console.log("Folder clicked:", folder)}
    />
  );
}
```

## Props

| Prop              | Type                       | Default      | Description                              |
| ----------------- | -------------------------- | ------------ | ---------------------------------------- |
| `folderId`        | `string`                   | **Required** | The ID of the shared folder to display   |
| `onFileClick`     | `(file: FileItem) => void` | `undefined`  | Callback when a file is clicked          |
| `onFolderClick`   | `(folder: Folder) => void` | `undefined`  | Callback when a folder is navigated to   |
| `className`       | `string`                   | `""`         | Additional CSS classes for the container |
| `showFileActions` | `boolean`                  | `true`       | Whether to show file action buttons      |
| `allowDownload`   | `boolean`                  | `true`       | Whether to allow file downloads          |
| `title`           | `string`                   | Folder name  | Custom title for the folder tree         |

## Multiple Folders Example

```tsx
import SharedFolderTree from "@/components/SharedFolderTree";

function MultipleSharedFolders() {
  const sharedFolderIds = ["folder-1", "folder-2", "folder-3"];

  return (
    <div className="space-y-8">
      {sharedFolderIds.map((folderId) => (
        <div key={folderId} className="bg-white rounded-lg shadow border">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Shared Folder: {folderId}</h2>
          </div>
          <SharedFolderTree
            folderId={folderId}
            onFileClick={(file) => handleFileClick(file, folderId)}
            onFolderClick={(folder) => handleFolderClick(folder, folderId)}
            showFileActions={true}
            allowDownload={true}
          />
        </div>
      ))}
    </div>
  );
}
```

## Advanced Usage with Custom Handlers

```tsx
import SharedFolderTree from "@/components/SharedFolderTree";
import { FileItem, Folder } from "@/types/vault";
import { toast } from "sonner";

function AdvancedExample() {
  const handleFileClick = (file: FileItem) => {
    // Custom file handling logic
    if (file.file_type.includes("pdf")) {
      // Handle PDF files differently
      openPDFViewer(file);
    } else {
      // Default download behavior
      window.open(file.storage_path, "_blank");
    }
    toast.success(`Opened ${file.name}`);
  };

  const handleFolderClick = (folder: Folder) => {
    // Custom folder navigation logic
    // You could trigger analytics, logging, etc.
  };

  return (
    <SharedFolderTree
      folderId="my-shared-folder"
      onFileClick={handleFileClick}
      onFolderClick={handleFolderClick}
      className="min-h-[600px]"
      showFileActions={true}
      allowDownload={true}
      title="Project Documents"
    />
  );
}
```

## Read-Only Mode

For read-only access where you want to limit actions:

```tsx
<SharedFolderTree
  folderId="readonly-folder"
  showFileActions={false}
  allowDownload={false}
  onFileClick={(file) => {
    // Custom preview logic instead of download
    previewFile(file);
  }}
/>
```

## API Integration

The component automatically fetches folder data using the API endpoint:

```
GET /vault/folder/shared/{folderId}/tree
```

Make sure your backend implements this endpoint to return the complete folder tree structure.

## File Structure

The component expects the following data structure:

```typescript
interface Folder {
  id: string;
  name: string;
  created_at: string;
  meta_data: Record<string, any>;
  children: Folder[];
  files: FileItem[];
}

interface FileItem {
  id: string;
  name: string;
  file_type: string;
  size: number;
  storage_path: string;
  created_at: string;
}
```

## Error Handling

The component includes built-in error handling:

- **Loading State**: Shows a spinner while fetching data
- **Error State**: Displays error message with retry button
- **Empty State**: Shows appropriate message when no content is found

## Styling

The component uses Tailwind CSS classes and can be customized:

```tsx
<SharedFolderTree
  folderId="folder-123"
  className="custom-folder-tree border-2 border-blue-500"
/>
```

## Demo Page

Check out the demo page at `/src/pages/SharedFolderDemo.tsx` for a complete working example with multiple folders.

## Dependencies

- React
- TypeScript
- Tailwind CSS
- Sonner (for toast notifications)
- Axios (for API calls)

## Best Practices

1. **Always provide error handling** for your `onFileClick` and `onFolderClick` handlers
2. **Use unique keys** when rendering multiple SharedFolderTree components
3. **Implement loading states** in your parent components for better UX
4. **Consider performance** when displaying many large folder trees simultaneously
5. **Validate folder IDs** before passing them to the component

## Troubleshooting

**Component not loading data:**

- Verify the folder ID is correct
- Check that the API endpoint is implemented
- Ensure proper authentication headers are set

**Files not downloading:**

- Verify `allowDownload` prop is set to `true`
- Check file storage paths are accessible
- Ensure proper CORS settings for file downloads
