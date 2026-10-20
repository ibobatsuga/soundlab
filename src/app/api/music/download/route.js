import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = [
  'storage.theapi.app',
  'api.goapi.ai',
  'imagedelivery.net',
  'tempfile.aiquickdraw.com',
  'cdn.udio.com',
  'theapi.app'
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'XXL_CHICKEN_EDM_TRACK.mp3';

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);
    
    // Strict SSRF guard: Whitelist check
    const isAllowed = ALLOWED_HOSTS.some(host => 
      parsed.hostname === host || parsed.hostname.endsWith('.' + host)
    );

    if (!isAllowed) {
      return NextResponse.json({ error: "Host audio tidak diizinkan." }, { status: 403 });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'XXLChicken-SoundLab/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal mengunduh audio: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    const arrayBuffer = await response.arrayBuffer();

    // Sanitize filename
    const safeFilename = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err) {
    // If stream fails, redirect safely to the target URL if it is in whitelist
    try {
      const parsed = new URL(targetUrl);
      const isAllowed = ALLOWED_HOSTS.some(host => 
        parsed.hostname === host || parsed.hostname.endsWith('.' + host)
      );
      if (isAllowed) {
        return NextResponse.redirect(targetUrl);
      }
    } catch (e) {
      // ignore
    }
    return NextResponse.json({ error: "Download stream error: " + err.message }, { status: 500 });
  }
}
