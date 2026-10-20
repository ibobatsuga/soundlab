import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  const title = searchParams.get('title') || 'XXL Banger';
  const genre = searchParams.get('genre') || 'Indobounce';
  const bpm = searchParams.get('bpm') || '132 BPM';

  if (!taskId) {
    return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
  }

  const apiKey = process.env.GOAPI_KEY || process.env.UDIO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GOAPI_KEY in environment variables" }, { status: 500 });
  }

  try {
    const pollRes = await fetch(`https://api.goapi.ai/api/v1/task/${taskId}`, {
      headers: {
        "X-API-Key": apiKey,
        "Authorization": `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    });

    if (!pollRes.ok) {
      throw new Error(`GoAPI HTTP ${pollRes.status}: ${pollRes.statusText}`);
    }

    const pollData = await pollRes.json();
    const task = pollData.data;

    if (!task) {
      return NextResponse.json({
        status: "processing",
        progress: "Menunggu respons dari Udio cluster...",
      });
    }

    const status = (task.status || "processing").toLowerCase();

    if (status === "completed" || status === "success") {
      const output = task.output || {};
      const songs = output.songs || [];

      // Udio (music-u) provides song_path or hosted_audio_url
      const songA = songs[0] || {};
      const songB = songs[1] || songA;

      const track1Url = songA.song_path || songA.hosted_audio_url || songA.audio_url || output.audio_url || songA.url;
      const track2Url = songB.song_path || songB.hosted_audio_url || songB.audio_url || songB.url || track1Url;
      const cover1 = songA.image_path || null;
      const cover2 = songB.image_path || cover1;

      const trackItems = [
        {
          id: "mix-a",
          label: `Mix A • ${songA.title || "Crispy Bouncy Drop"} (Udio AI)`,
          sublabel: "Fokus pada hook vokal melodis & punchy drop festival",
          url: track1Url,
          coverUrl: cover1,
          duration: songA.duration ? `${Math.floor(songA.duration / 60)}:${Math.floor(songA.duration % 60).toString().padStart(2, '0')}` : "02:11",
          bpm: bpm.split(" ")[0] || "132",
          energy: "94%",
          tags: songA.tags || ["electronic", "edm", "festival"],
        },
        {
          id: "mix-b",
          label: `Mix B • ${songB.title || "Heavy XXL Drop"} (Udio AI)`,
          sublabel: "Sub-bass 808 overdriven ekstra tebal untuk dancefloor booster",
          url: track2Url,
          coverUrl: cover2,
          duration: songB.duration ? `${Math.floor(songB.duration / 60)}:${Math.floor(songB.duration % 60).toString().padStart(2, '0')}` : "02:11",
          bpm: bpm.split(" ")[0] || "132",
          energy: "98%",
          tags: songB.tags || ["electronic", "house", "bass"],
        },
      ];

      return NextResponse.json({
        status: "completed",
        success: true,
        title,
        genre,
        bpm,
        audioUrl: track1Url,
        audioUrls: [track1Url, track2Url],
        trackItems,
        songs,
        coverUrl: cover1,
        engine: "Udio AI (GoAPI music-u)",
      });
    }

    if (status === "failed" || status === "error") {
      const errMsg = task?.error?.message || task?.detail || "Pembuatan lagu gagal di Udio AI cluster.";
      return NextResponse.json({
        status: "failed",
        error: errMsg,
      });
    }

    // Still in progress / pending
    return NextResponse.json({
      status: status, // "pending" or "processing"
      progress: task?.detail || (status === "pending" ? "Antrean model Udio AI disiapkan..." : "Udio AI sedang meracik multi-track audio..."),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memverifikasi status task: " + err.message },
      { status: 500 }
    );
  }
}
