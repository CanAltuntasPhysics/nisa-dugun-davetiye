import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { GOOGLE_DRIVE_SCOPES } from "@/lib/googleDriveScopes";

/**
 * GET /api/auth/google
 *
 * Redirects the user to Google OAuth2 consent screen.
 * Used once to authorize the app and get a refresh token.
 *
 * After authorization, Google redirects to /api/auth/callback
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local" },
      { status: 500 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${new URL(request.url).origin}/api/auth/callback`
  );

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    include_granted_scopes: true,
    prompt: "consent",
    scope: [...GOOGLE_DRIVE_SCOPES],
  });

  console.log("🔗 [AUTH] Redirecting to Google consent screen...");

  return NextResponse.redirect(authorizeUrl);
}
