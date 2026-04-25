export const DEFAULT_DRIVE_FOLDER_ID = "1PiBia5pls86R3qf9F3eUokBdhOQKJXTd";

export function getGalleryFolderId() {
  return (
    process.env.DRIVE_GALLERY_FOLDER_ID ||
    process.env.DRIVE_UPLOAD_FOLDER_ID ||
    DEFAULT_DRIVE_FOLDER_ID
  );
}

export function getUploadFolderId() {
  return (
    process.env.DRIVE_UPLOAD_FOLDER_ID ||
    process.env.DRIVE_GALLERY_FOLDER_ID ||
    DEFAULT_DRIVE_FOLDER_ID
  );
}
