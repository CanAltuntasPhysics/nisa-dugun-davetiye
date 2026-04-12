import { google } from "googleapis";

/**
 * Google Drive service abstraction using OAuth2 + Refresh Token.
 *
 * This approach uses the folder owner's personal Google account quota,
 * avoiding the "Service Accounts do not have storage quota" limitation.
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID         – OAuth2 Client ID (Desktop app)
 *   GOOGLE_CLIENT_SECRET     – OAuth2 Client Secret
 *   GOOGLE_REFRESH_TOKEN     – Refresh token obtained via one-time consent flow
 *   DRIVE_UPLOAD_FOLDER_ID   – Target folder for uploads
 *   DRIVE_GALLERY_FOLDER_ID  – Source folder for gallery display
 */

function getAuth() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing Google OAuth2 credentials. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN."
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "http://localhost:3000/api/auth/callback"
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

function getDrive() {
  return google.drive({ version: "v3", auth: getAuth() });
}

export interface UploadResult {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
}

/**
 * Upload a file to the incoming/upload folder on Google Drive.
 * Uses the authenticated user's storage quota.
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  uploaderName?: string
): Promise<UploadResult> {
  const drive = getDrive();
  const folderId = process.env.DRIVE_UPLOAD_FOLDER_ID;

  if (!folderId) {
    throw new Error("DRIVE_UPLOAD_FOLDER_ID is not set.");
  }

  // Build file name with optional uploader name as prefix metadata
  const safeName = uploaderName
    ? `[${uploaderName}] ${fileName}`
    : fileName;

  const fileSizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(2);
  console.log(`📤 [UPLOAD START] File: "${safeName}" | Size: ${fileSizeMB}MB | Type: ${mimeType}`);
  console.log(`📁 [UPLOAD] Target folder: ${folderId}`);

  const { Readable } = await import("stream");
  const stream = new Readable();
  stream.push(fileBuffer);
  stream.push(null);

  const startTime = Date.now();

  try {
    const response = await drive.files.create({
      requestBody: {
        name: safeName,
        parents: [folderId],
        description: JSON.stringify({
          uploaderName: uploaderName || "Anonim",
          uploadedAt: new Date().toISOString(),
          eventSlug: "nisa-omer-2026",
          approved: false,
          mediaType: mimeType.startsWith("video") ? "video" : "image",
        }),
      },
      media: {
        mimeType,
        body: stream,
      },
      fields: "id, name, mimeType, webViewLink",
    });

    const fileId = response.data.id!;

    // Make the file publicly viewable so gallery thumbnails work
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      console.log(`🔓 [PERMISSION] File set to public: ${fileId}`);
    } catch (permError) {
      console.warn(`⚠️  [PERMISSION] Could not set public access for ${fileId}:`, 
        permError instanceof Error ? permError.message : permError);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ [UPLOAD SUCCESS] File: "${safeName}" | Drive ID: ${fileId} | Duration: ${duration}s`);

    return {
      id: fileId,
      name: response.data.name!,
      mimeType: response.data.mimeType!,
      webViewLink: response.data.webViewLink || undefined,
    };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`❌ [UPLOAD FAILED] File: "${safeName}" | Duration: ${duration}s`);
    console.error(`❌ [UPLOAD ERROR]`, error instanceof Error ? error.message : error);
    throw error;
  }
}

