import { NextRequest, NextResponse } from "next/server";
import { DriveError, listGalleryFilesPage } from "@/lib/drive";

const PAGE_SIZE = 8;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get("pageToken") || undefined;

  if (pageToken && pageToken.length > 4096) {
    return NextResponse.json({ error: "Invalid page token" }, { status: 400 });
  }

  try {
    const page = await listGalleryFilesPage({
      pageSize: PAGE_SIZE,
      pageToken,
    });

    return NextResponse.json(page);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Galeri yüklenirken hata oluştu.";
    const status = error instanceof DriveError ? error.status : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
