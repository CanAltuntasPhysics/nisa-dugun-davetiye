import type { Metadata } from "next";
import { getUploadFolderId } from "@/lib/driveConfig";
import PhotosClient from "./PhotosClient";

export const metadata: Metadata = {
  title: "Fotoğraf Paylaş — Nisa & Ömer",
  description: "Düğün fotoğraflarınızı bizimle paylaşın.",
};

export default function PhotosPage() {
  const driveUrl = `https://drive.google.com/drive/folders/${getUploadFolderId()}`;

  return <PhotosClient galleryUrl="/photos/gallery" driveUrl={driveUrl} />;
}
