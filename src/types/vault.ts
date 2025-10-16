export interface FileItem {
  id: string;
  name: string;
  size: number;
  user_id: string;
  file_type: string;
  folder_id: string;
  created_at: string; // ISO date string
  storage_path: string;
  tags: string[]; // New field for tags
}
export interface Folder {
  id: string;
  name: string;
  files: FileItem[];
  user_id: string;
  children: Folder[]; // Recursive type
  meta_data: Record<string, string>; // Assumed to be a free-form object
  parent_id: string | null;
  created_at: string; // ISO date string
}
