import { NextResponse } from "next/server";
import { google } from "googleapis";

/**
 * POST /api/photos/fix-permissions
 *
 * One-time utility to make all existing Drive files publicly viewable.
 * This fixes gallery thumbnails for files uploaded before the permission fix.
 *
 * Call this once, then it can be removed.
 */
export async function POST() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const folderId = process.env.DRIVE_GALLERY_FOLDER_ID;

    if (!clientId || !clientSecret || !refreshToken || !folderId) {
      return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Make the folder itself publicly viewable so the "Galeriyi Görüntüle"
    // link opens without an access request prompt.
    let folderFixed = false;
    try {
      await drive.permissions.create({
        fileId: folderId,
        requestBody: { role: "reader", type: "anyone" },
      });
      folderFixed = true;
      console.log(`🔓 [FIX] Gallery folder set to public: ${folderId}`);
    } catch (err) {
      console.error(
        `❌ [FIX] Failed to set folder public:`,
        err instanceof Error ? err.message : err
      );
    }

    // List all files in the folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      pageSize: 100,
      fields: "files(id, name)",
    });

    const files = response.data.files || [];
    console.log(`🔧 [FIX] Found ${files.length} files to fix permissions`);

    let fixed = 0;
    let errors = 0;

    for (const file of files) {
      try {
        await drive.permissions.create({
          fileId: file.id!,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        });
        console.log(`🔓 [FIX] Set public: ${file.name} (${file.id})`);
        fixed++;
      } catch (err) {
        console.error(`❌ [FIX] Failed: ${file.name}`, err instanceof Error ? err.message : err);
        errors++;
      }
    }

    console.log(`🔧 [FIX] Done! Fixed: ${fixed}, Errors: ${errors}`);

    return NextResponse.json({
      success: true,
      folderFixed,
      total: files.length,
      fixed,
      errors,
    });
  } catch (error) {
    console.error("Fix permissions error:", error);
    return NextResponse.json(
      { error: "İzinler düzeltilirken hata oluştu." },
      { status: 500 }
    );
  }
}
