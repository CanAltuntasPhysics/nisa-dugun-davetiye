export const GOOGLE_DRIVE_SCOPES = [
  // Required for files that guests upload directly into the Drive folder.
  "https://www.googleapis.com/auth/drive.readonly",
  // Keeps compatibility with app-created files if the upload helper is used.
  "https://www.googleapis.com/auth/drive.file",
] as const;
