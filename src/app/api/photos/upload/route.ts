import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/drive";

/**
 * POST /api/photos/upload
 *
 * Accepts multipart/form-data with:
 *   - file / files: one or more photo/video files
 *   - uploaderName: (optional) name of the guest
 *
 * Uploads the file(s) to Google Drive and returns the results.
 */
export async function POST(request: NextRequest) {
  const requestStart = Date.now();
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📸 [API] POST /api/photos/upload");

  try {
    const formData = await request.formData();
    const uploaderName = formData.get("uploaderName") as string | null;

    // Collect all files from the form data (supports both single 'file' and multiple 'files')
    const files: File[] = [];
    
    // Check for single 'file' field
    const singleFile = formData.get("file") as File | null;
    if (singleFile && singleFile instanceof File) {
      files.push(singleFile);
    }
    
    // Check for multiple 'files' fields
    const multipleFiles = formData.getAll("files");
    for (const f of multipleFiles) {
      if (f instanceof File) {
        files.push(f);
      }
    }

    if (files.length === 0) {
      console.log("⚠️  [API] No files found in request");
      return NextResponse.json(
        { error: "Dosya bulunamadı. Lütfen bir fotoğraf seçin." },
        { status: 400 }
      );
    }

    console.log(`📸 [API] Uploader: "${uploaderName || "Anonim"}" | Files: ${files.length}`);

    // Validate all files first
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
      "video/mp4",
      "video/quicktime",
    ];

    const MAX_SIZE = 50 * 1024 * 1024; // 50MB per file

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        console.log(`⚠️  [API] Invalid file type: ${file.type} (${file.name})`);
        return NextResponse.json(
          { error: `Desteklenmeyen dosya türü: ${file.name}. Lütfen JPEG, PNG, WebP veya MP4 dosyası yükleyin.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        console.log(`⚠️  [API] File too large: ${file.name} (${sizeMB}MB)`);
        return NextResponse.json(
          { error: `${file.name} dosyası çok büyük (${sizeMB}MB). Maksimum 50MB yükleyebilirsiniz.` },
          { status: 400 }
        );
      }
    }

    // Upload all files
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`\n📤 [API] Uploading file ${i + 1}/${files.length}: "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadFile(
          buffer,
          file.name,
          file.type,
          uploaderName || undefined
        );
        results.push(result);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Bilinmeyen hata";
        console.error(`❌ [API] Failed to upload "${file.name}": ${errorMsg}`);
        errors.push({ fileName: file.name, error: errorMsg });
      }
    }

    const totalDuration = ((Date.now() - requestStart) / 1000).toFixed(1);

    if (results.length === 0) {
      console.error(`❌ [API] All uploads failed | Duration: ${totalDuration}s`);
      return NextResponse.json(
        { error: "Yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.", errors },
        { status: 500 }
      );
    }

    console.log(`\n✅ [API] Upload complete | Success: ${results.length}/${files.length} | Duration: ${totalDuration}s`);
    if (errors.length > 0) {
      console.warn(`⚠️  [API] ${errors.length} file(s) failed`);
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return NextResponse.json({
      success: true,
      uploadedCount: results.length,
      totalCount: files.length,
      files: results,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    const totalDuration = ((Date.now() - requestStart) / 1000).toFixed(1);
    console.error(`❌ [API] Upload error | Duration: ${totalDuration}s`);
    console.error("❌ [API] Error details:", error instanceof Error ? error.message : error);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return NextResponse.json(
      { error: "Yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
