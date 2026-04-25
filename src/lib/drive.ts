import { google } from "googleapis";
import { getGalleryFolderId } from "@/lib/driveConfig";

/**
 * Google Drive service abstraction using OAuth2 + Refresh Token.
 *
 * This approach uses the folder owner's personal Google account quota,
 * avoiding the "Service Accounts do not have storage quota" limitation.
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID         – OAuth2 Client ID (Web app)
 *   GOOGLE_CLIENT_SECRET     – OAuth2 Client Secret
 *   GOOGLE_REFRESH_TOKEN     – Refresh token obtained via one-time consent flow
 *   DRIVE_UPLOAD_FOLDER_ID   – Target folder for uploads
 *   DRIVE_GALLERY_FOLDER_ID  – Source folder for gallery display
 */

export class DriveError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "DriveError";
    this.status = status;
  }
}

interface GoogleApiErrorShape {
  code?: number;
  message?: string;
  response?: {
    status?: number;
    data?: {
      error?:
        | string
        | {
            message?: string;
            errors?: Array<{ reason?: string; message?: string }>;
          };
      error_description?: string;
    };
  };
}

function getDriveApiErrorDetails(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return { status: undefined, message: undefined, reasons: [] as string[] };
  }

  const apiError = error as GoogleApiErrorShape;
  const errorData = apiError.response?.data?.error;
  const errorMessage =
    typeof errorData === "string"
      ? errorData
      : errorData?.message ||
        apiError.response?.data?.error_description ||
        apiError.message;

  const reasons =
    typeof errorData === "object" && errorData.errors
      ? errorData.errors
          .map((item) => item.reason || item.message)
          .filter((item): item is string => Boolean(item))
      : [];

  return {
    status: apiError.response?.status || apiError.code,
    message: errorMessage,
    reasons,
  };
}

function toDriveError(error: unknown, action: string): DriveError {
  if (error instanceof DriveError) return error;

  const { status, message, reasons } = getDriveApiErrorDetails(error);
  const searchable = [message, ...reasons].filter(Boolean).join(" ");

  if (
    status === 401 ||
    status === 403 ||
    /insufficient|scope|unauthorized|invalid_grant/i.test(searchable)
  ) {
    return new DriveError(
      `${action} için Google Drive yetkisi yetersiz. GOOGLE_REFRESH_TOKEN eski veya dar kapsamlı olabilir; /api/auth/google üzerinden yeni refresh token üretin.`,
      403
    );
  }

  if (status === 404) {
    return new DriveError(`${action} için Google Drive dosyası bulunamadı.`, 404);
  }

  return new DriveError(
    message ? `${action} başarısız: ${message}` : `${action} başarısız oldu.`,
    status || 500
  );
}

function shouldUsePublicFallback(error: unknown) {
  if (error instanceof DriveError) {
    return error.status === 401 || error.status === 403;
  }

  const { status, message, reasons } = getDriveApiErrorDetails(error);
  const searchable = [message, ...reasons].filter(Boolean).join(" ");

  return (
    status === 401 ||
    status === 403 ||
    /insufficient|scope|unauthorized|invalid_grant/i.test(searchable)
  );
}

function getAuth() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing Google OAuth2 credentials. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN."
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

function hasOAuthCredentials() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
  );
}

function getDriveApiKey() {
  return process.env.GOOGLE_DRIVE_API_KEY || process.env.GOOGLE_API_KEY;
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

export interface GalleryFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  hasThumbnail: boolean;
}

export interface GalleryFilesPage {
  files: GalleryFile[];
  nextPageToken: string | null;
}

interface ListGalleryFilesPageOptions {
  pageSize: number;
  pageToken?: string;
}

export async function listGalleryFilesPage({
  pageSize,
  pageToken,
}: ListGalleryFilesPageOptions): Promise<GalleryFilesPage> {
  const folderId = getGalleryFolderId();

  if (hasOAuthCredentials()) {
    try {
      return await listGalleryFilesPageWithOAuth({ folderId, pageSize, pageToken });
    } catch (error) {
      if (!shouldUsePublicFallback(error)) throw error;
      console.warn(
        "[DRIVE] OAuth failed while listing gallery; falling back to public folder.",
        error instanceof Error ? error.message : error
      );
    }
  }

  if (getDriveApiKey()) {
    return listGalleryFilesPageWithApiKey({ folderId, pageSize, pageToken });
  }

  return listGalleryFilesPageFromPublicFolder({ folderId, pageSize, pageToken });
}

async function listGalleryFilesPageWithOAuth({
  folderId,
  pageSize,
  pageToken,
}: ListGalleryFilesPageOptions & {
  folderId: string;
}): Promise<GalleryFilesPage> {
  const drive = getDrive();
  const files: GalleryFile[] = [];

  let response;
  try {
    response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false and (mimeType contains 'image/' or mimeType contains 'video/')`,
      pageSize,
      pageToken,
      orderBy: "createdTime desc",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      fields:
        "nextPageToken, files(id, name, mimeType, createdTime, hasThumbnail)",
    });
  } catch (error) {
    throw toDriveError(error, "Galeri dosyaları listelenirken");
  }

  for (const f of response.data.files || []) {
    if (!f.id || !f.name || !f.mimeType || !f.createdTime) continue;
    files.push({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      createdTime: f.createdTime,
      hasThumbnail: !!f.hasThumbnail,
    });
  }

  return {
    files,
    nextPageToken: response.data.nextPageToken || null,
  };
}

async function listGalleryFilesPageWithApiKey({
  folderId,
  pageSize,
  pageToken,
}: ListGalleryFilesPageOptions & {
  folderId: string;
}): Promise<GalleryFilesPage> {
  const apiKey = getDriveApiKey();
  if (!apiKey) {
    throw new DriveError("GOOGLE_DRIVE_API_KEY is not set.", 500);
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: `'${folderId}' in parents and trashed = false and (mimeType contains 'image/' or mimeType contains 'video/')`,
    pageSize: String(pageSize),
    orderBy: "createdTime desc",
    includeItemsFromAllDrives: "true",
    supportsAllDrives: "true",
    fields:
      "nextPageToken, files(id, name, mimeType, createdTime, hasThumbnail)",
  });
  if (pageToken) params.set("pageToken", pageToken);

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new DriveError(
      `Public Drive klasörü listelenemedi: ${await response.text()}`,
      response.status
    );
  }

  const data = (await response.json()) as {
    nextPageToken?: string;
    files?: Array<{
      id?: string;
      name?: string;
      mimeType?: string;
      createdTime?: string;
      hasThumbnail?: boolean;
    }>;
  };

  return {
    files: (data.files || [])
      .filter(
        (file): file is GalleryFile =>
          Boolean(file.id && file.name && file.mimeType && file.createdTime)
      )
      .map((file) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        createdTime: file.createdTime,
        hasThumbnail: Boolean(file.hasThumbnail),
      })),
    nextPageToken: data.nextPageToken || null,
  };
}

async function listGalleryFilesPageFromPublicFolder({
  folderId,
  pageSize,
  pageToken,
}: ListGalleryFilesPageOptions & {
  folderId: string;
}): Promise<GalleryFilesPage> {
  const files = await listPublicFolderFiles(folderId);
  const start = pageToken ? Number(pageToken) : 0;
  const safeStart = Number.isInteger(start) && start > 0 ? start : 0;
  const nextStart = safeStart + pageSize;

  return {
    files: files.slice(safeStart, nextStart),
    nextPageToken: nextStart < files.length ? String(nextStart) : null,
  };
}

async function listPublicFolderFiles(folderId: string): Promise<GalleryFile[]> {
  const response = await fetch(
    `https://drive.google.com/drive/folders/${folderId}?usp=sharing`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new DriveError(
      `Public Drive klasörü açılamadı: ${response.statusText}`,
      response.status
    );
  }

  const html = await response.text();
  const match = html.match(
    /window\['_DRIVE_ivd'\]\s*=\s*'((?:\\.|[^'])*)'/
  );

  if (!match) {
    throw new DriveError(
      "Public Drive klasörü okunamadı. Klasör paylaşımını 'Anyone with the link' olarak ayarlayın veya GOOGLE_DRIVE_API_KEY ekleyin.",
      403
    );
  }

  const decoded = decodeDriveStringLiteral(match[1]);
  const data = JSON.parse(decoded) as unknown;
  const rows = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];

  return rows
    .filter((row): row is unknown[] => Array.isArray(row))
    .map((row) => {
      const id = typeof row[0] === "string" ? row[0] : null;
      const name = typeof row[2] === "string" ? row[2] : null;
      const mimeType = typeof row[3] === "string" ? row[3] : null;
      const timestamp =
        typeof row[9] === "number"
          ? row[9]
          : typeof row[10] === "number"
            ? row[10]
            : Date.now();

      if (!id || !name || !mimeType) return null;
      if (!mimeType.startsWith("image/") && !mimeType.startsWith("video/")) {
        return null;
      }

      return {
        id,
        name,
        mimeType,
        createdTime: new Date(timestamp).toISOString(),
        hasThumbnail: true,
      };
    })
    .filter((file): file is GalleryFile => Boolean(file))
    .sort(
      (a, b) =>
        new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
    );
}

function decodeDriveStringLiteral(value: string) {
  return value
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex: string) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/\\([^"\\/bfnrtu])/g, "$1");
}

export async function listGalleryFiles(): Promise<GalleryFile[]> {
  const files: GalleryFile[] = [];
  let pageToken: string | undefined;

  do {
    const page = await listGalleryFilesPage({
      pageSize: 200,
      pageToken,
    });
    files.push(...page.files);
    pageToken = page.nextPageToken || undefined;
  } while (pageToken);

  return files;
}

export async function getFileMedia(fileId: string): Promise<{
  stream: NodeJS.ReadableStream;
  mimeType: string;
  size?: number;
}> {
  if (!hasOAuthCredentials()) {
    return getPublicFileMedia(fileId);
  }

  const drive = getDrive();

  try {
    const meta = await drive.files.get({
      fileId,
      fields: "mimeType, size",
      supportsAllDrives: true,
    });

    const response = await drive.files.get(
      { fileId, alt: "media", supportsAllDrives: true },
      { responseType: "stream" }
    );

    return {
      stream: response.data as NodeJS.ReadableStream,
      mimeType: meta.data.mimeType || "application/octet-stream",
      size: meta.data.size ? Number(meta.data.size) : undefined,
    };
  } catch (error) {
    if (shouldUsePublicFallback(error)) {
      console.warn(
        "[DRIVE] OAuth failed while reading media; falling back to public file.",
        error instanceof Error ? error.message : error
      );
      return getPublicFileMedia(fileId);
    }
    throw toDriveError(error, "Medya dosyası okunurken");
  }
}

export async function getFileThumbnail(
  fileId: string,
  size: number = 400
): Promise<{ body: ReadableStream<Uint8Array>; mimeType: string } | null> {
  if (!hasOAuthCredentials()) {
    return getPublicFileThumbnail(fileId, size);
  }

  const drive = getDrive();
  const auth = getAuth();

  try {
    const meta = await drive.files.get({
      fileId,
      fields: "thumbnailLink, mimeType",
      supportsAllDrives: true,
    });

    const thumbnailLink = meta.data.thumbnailLink;
    if (!thumbnailLink) return null;

    // thumbnailLink ends with =s220; swap for a larger size
    const sized = thumbnailLink.replace(/=s\d+$/, `=s${size}`);

    const token = await auth.getAccessToken();
    const accessToken = typeof token === "string" ? token : token?.token;

    const res = await fetch(sized, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    if (!res.ok || !res.body) return null;

    return {
      body: res.body,
      mimeType: res.headers.get("content-type") || "image/jpeg",
    };
  } catch (error) {
    if (shouldUsePublicFallback(error)) {
      console.warn(
        "[DRIVE] OAuth failed while reading thumbnail; falling back to public thumbnail.",
        error instanceof Error ? error.message : error
      );
      return getPublicFileThumbnail(fileId, size);
    }
    throw toDriveError(error, "Önizleme görseli okunurken");
  }
}

async function getPublicFileThumbnail(
  fileId: string,
  size: number
): Promise<{ body: ReadableStream<Uint8Array>; mimeType: string } | null> {
  const response = await fetch(
    `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${size}`,
    { redirect: "follow" }
  );

  if (!response.ok || !response.body) return null;

  return {
    body: response.body,
    mimeType: response.headers.get("content-type") || "image/jpeg",
  };
}

async function getPublicFileMedia(fileId: string): Promise<{
  stream: NodeJS.ReadableStream;
  mimeType: string;
  size?: number;
}> {
  const response = await fetch(
    `https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}`,
    { redirect: "follow" }
  );

  if (!response.ok || !response.body) {
    throw new DriveError("Public Drive dosyası okunamadı.", response.status);
  }

  const { Readable } = await import("stream");
  const stream = Readable.fromWeb(
    response.body as Parameters<typeof Readable.fromWeb>[0]
  ) as NodeJS.ReadableStream;

  const contentLength = response.headers.get("content-length");

  return {
    stream,
    mimeType: response.headers.get("content-type") || "application/octet-stream",
    size: contentLength ? Number(contentLength) : undefined,
  };
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
      supportsAllDrives: true,
    });

    const fileId = response.data.id!;

    // Make the file publicly viewable so gallery thumbnails work
    try {
      await drive.permissions.create({
        fileId,
        supportsAllDrives: true,
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
