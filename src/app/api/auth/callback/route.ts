import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

/**
 * GET /api/auth/callback
 *
 * Handles the OAuth2 callback from Google.
 * Exchanges the authorization code for tokens and displays the refresh token.
 *
 * This is a ONE-TIME setup route. Copy the refresh token to .env.local
 * and then these auth routes can be removed.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("❌ [AUTH CALLBACK] Error:", error);
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;background:#1a1a1a;color:#e0e0e0;">
        <h1 style="color:#ff6b6b;">❌ Yetkilendirme Hatası</h1>
        <p>Google yetkilendirme reddedildi: ${error}</p>
        <a href="/api/auth/google" style="color:#ffd700;">Tekrar Dene →</a>
      </body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;background:#1a1a1a;color:#e0e0e0;">
        <h1 style="color:#ff6b6b;">❌ Kod Bulunamadı</h1>
        <p>Yetkilendirme kodu alınamadı.</p>
        <a href="/api/auth/google" style="color:#ffd700;">Tekrar Dene →</a>
      </body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set." },
      { status: 500 }
    );
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      `${new URL(request.url).origin}/api/auth/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);

    console.log("\n🔑 ═══════════════════════════════════════════");
    console.log("🔑 [AUTH] REFRESH TOKEN RECEIVED!");
    console.log("🔑 ═══════════════════════════════════════════");
    console.log(`🔑 Refresh Token: ${tokens.refresh_token}`);
    console.log("🔑 ═══════════════════════════════════════════");
    console.log("🔑 Add this to your .env.local as GOOGLE_REFRESH_TOKEN");
    console.log("🔑 ═══════════════════════════════════════════\n");

    return new NextResponse(
      `<html>
        <body style="font-family:sans-serif;padding:40px;background:#1a1a1a;color:#e0e0e0;max-width:700px;margin:0 auto;">
          <h1 style="color:#4ecdc4;">✅ Yetkilendirme Başarılı!</h1>
          <p style="color:#aaa;margin-bottom:24px;">Aşağıdaki refresh token'ı <code>.env.local</code> dosyasına kopyalayın:</p>
          
          <div style="background:#2d2d2d;padding:20px;border-radius:12px;border:1px solid #444;margin-bottom:24px;">
            <p style="color:#888;font-size:12px;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:1px;">GOOGLE_REFRESH_TOKEN</p>
            <code style="color:#ffd700;font-size:14px;word-break:break-all;line-height:1.6;">${tokens.refresh_token}</code>
          </div>

          <div style="background:#2d3a2d;padding:16px;border-radius:8px;border:1px solid #4a5;margin-bottom:24px;">
            <p style="margin:0;color:#8f8;">📝 <code>.env.local</code> dosyasına şu satırı ekleyin:</p>
            <pre style="margin:12px 0 0 0;color:#cfc;background:#1a2a1a;padding:12px;border-radius:6px;overflow-x:auto;">GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
          </div>

          <p style="color:#888;font-size:13px;">Bu işlemi sadece bir kere yapmanız yeterli. Token süresi dolmaz.</p>
          <p style="color:#888;font-size:13px;">Token'ı ekledikten sonra dev server'ı yeniden başlatın.</p>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (err) {
    console.error("❌ [AUTH CALLBACK] Token exchange error:", err);
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;background:#1a1a1a;color:#e0e0e0;">
        <h1 style="color:#ff6b6b;">❌ Token Hatası</h1>
        <p>${err instanceof Error ? err.message : "Bilinmeyen hata"}</p>
        <a href="/api/auth/google" style="color:#ffd700;">Tekrar Dene →</a>
      </body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}
