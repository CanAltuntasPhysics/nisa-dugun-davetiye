import type { Metadata } from "next";
import PhotosClient from "./PhotosClient";

export const metadata: Metadata = {
  title: "Fotoğraf Paylaş — Nisa & Ömer",
  description: "Düğün fotoğraflarınızı bizimle paylaşın.",
};

export default function PhotosPage() {
  const folderId = process.env.DRIVE_GALLERY_FOLDER_ID;
  const galleryUrl = folderId
    ? `https://drive.google.com/drive/folders/${folderId}`
    : "#";

  return <PhotosClient galleryUrl={galleryUrl} />;
}
