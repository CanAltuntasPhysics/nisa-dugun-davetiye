import type { Metadata } from "next";
import PhotosClient from "./PhotosClient";

export const metadata: Metadata = {
  title: "Fotoğraf Paylaş — Nisa & Ömer",
  description: "Düğün fotoğraflarınızı bizimle paylaşın.",
};

export default function PhotosPage() {
  const folderId = process.env.DRIVE_GALLERY_FOLDER_ID;
  const driveUrl = folderId
    ? `https://drive.google.com/drive/folders/${folderId}`
    : null;

  return <PhotosClient galleryUrl="/photos/gallery" driveUrl={driveUrl} />;
}
