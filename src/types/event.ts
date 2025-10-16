export interface EventInterface {
  id?: string | null; // UUID
  title?: string | null;
  description?: string | null;
  start_date?: string | null; // ISO Date string (YYYY-MM-DD)
  type?: string | null;
  location?: string | null;
  created_at?: string | null; // ISO timestamp
  updated_at?: string | null; // ISO timestamp
  created_by?: string | null; // UUID
  website?: string | null;
  banner?: string | null;
  judges_emails?: string[] | null;
  stages?: any[] | null; // JSON[] can be any structure – replace 'any' with a specific type if known
  coordinates?: number[] | null; // [latitude, longitude]
  location_name?: string | null;
  statuses?: string[] | null;
}

// create table public.form (
//   id uuid not null default gen_random_uuid (),
//   event_id uuid not null,
//   type text not null,
//   details json null,
//   "order" integer null,
//   created_at timestamp with time zone null default now(),
//   required boolean null,
//   constraint form_pkey primary key (id),
//   constraint form_event_id_fkey foreign KEY (event_id) references events (id) on delete CASCADE
// ) TABLESPACE pg_default;
export interface FormBuilderData {
  id?: string | null; // UUID
  type: string; // e.g., "registration", "feedback"
  details: any; // JSON structure for form fields
  order?: number | null; // Order of the form in the event
  created_at?: string | null; // ISO timestamp
  required?: boolean | null; // Whether the form is required
  files?: string[] | null; // Array of file IDs or URLs
  folders?: string[] | null; // Array of folder IDs or names
}
