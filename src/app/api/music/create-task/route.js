import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEMO_STEMS = {
  "Indobounce": [
    "https://storage.theapi.app/audio/udio/20261020/44bb52bd-ee60-4470-9a75-bae865abcc5e.mp3",
    "https://storage.theapi.app/audio/udio/20261020/4c3a6e83-7d21-4d38-b434-56a857ce943b.mp3",
  ],
  "Drift Phonk": [
    "https://tempfile.aiquickdraw.com/r/97ce817d-d4d0-4d6a-8de7-4a9b850c2fc0.mp3",
    "https://tempfile.aiquickdraw.com/r/bec2c050-c666-4ad1-bed4-529098d530a3.mp3",
  ],
  "Slap House": [
    "https://tempfile.aiquickdraw.com/r/bec2c050-c666-4ad1-bed4-529098d530a3.mp3",
    "https://tempfile.aiquickdraw.com/r/4a89a4e5-bdf8-4812-b404-bffc453b345b.mp3",
  ],
  "Hardstyle": [
    "https://tempfile.aiquickdraw.com/r/4a89a4e5-bdf8-4812-b404-bffc453b345b.mp3",
    "https://storage.theapi.app/audio/udio/20261020/44bb52bd-ee60-4470-9a75-bae865abcc5e.mp3",
  ],
  "Jersey Club": [
    "https://storage.theapi.app/audio/udio/20261020/4c3a6e83-7d21-4d38-b434-56a857ce943b.mp3",
    "https://tempfile.aiquickdraw.com/r/97ce817d-d4d0-4d6a-8de7-4a9b850c2fc0.mp3",
  ],
  "default": [
    "https://storage.theapi.app/audio/udio/20261020/44bb52bd-ee60-4470-9a75-bae865abcc5e.mp3",
    "https://storage.theapi.app/audio/udio/20261020/4c3a6e83-7d21-4d38-b434-56a857ce943b.mp3",
  ],
};

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      genre = "Indobounce",
      artistReference = "Whisnu Santika",
      vocalType = "hype_mc",
      dropIntensity = "heavy",
      tempo = "132 BPM",
      lyrics = "",
      title = "",
      isSandbox = false,
      _internalTransactionId,
    } = body;

    const apiKey = process.env.GOAPI_KEY || process.env.UDIO_API_KEY;
    const songTitle = title.trim() || generateEdmTitle(genre, artistReference);

    // If live API key is present and NOT running in sandbox-demo mode
    if (apiKey && !isSandbox) {
      const isInstrumental = vocalType === "instrumental";
      const promptDescription = `${genre}, ${tempo}, ${artistReference} style, electronic club festival, ${dropIntensity} drop, punchy kicks, crispy sub-bass`;

      const createResponse = await fetch("https://api.goapi.ai/api/v1/task", {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "music-u",
          task_type: "generate_music",
          input: {
            gpt_description_prompt: promptDescription,
            lyrics: isInstrumental ? "" : (lyrics || `[Intro]\nLampu neon menyala di Jakarta\n\n[Build-Up]\nAre you ready for the drop?\n3... 2... 1... GO!\n\n[DROP]\n(Crispy XXL Bass Drop)`),
            lyrics_type: isInstrumental ? "instrumental" : (lyrics ? "user" : "generate"),
            negative_tags: isInstrumental ? "vocals, singing" : "",
            seed: -1,
          },
        }),
      });

      const taskData = await createResponse.json();

      if (!createResponse.ok || taskData.code !== 200) {
        return NextResponse.json({
          success: false,
          error: taskData.message || "GoAPI Udio menolak task pembuatan lagu.",
          code: taskData.code || createResponse.status,
          apiErrorDetail: taskData.detail || null,
        }, { status: 400 });
      }

      const taskId = taskData.data?.task_id;
      if (!taskId) {
        return NextResponse.json({
          success: false,
          error: "Task ID tidak diterima dari GoAPI cluster.",
        }, { status: 502 });
      }

      return NextResponse.json({
        success: true,
        isDemo: false,
        taskId,
        title: songTitle,
        genre,
        bpm: tempo,
        description: `Diramu langsung via GoAPI Udio AI (music-u). Style ${artistReference} dengan aransemen ${dropIntensity} drop.`,
        transactionId: _internalTransactionId || null,
      });
    }

    // Sandbox or Instant Demo Stems Mode
    const audioPair = DEMO_STEMS[genre] || DEMO_STEMS["default"];
    const trackItems = [
      {
        id: "mix-a",
        label: `Mix A • ${songTitle} (Crispy Bouncy Drop)`,
        sublabel: "Fokus pada hook vokal melodis & punchy drop festival",
        url: audioPair[0],
        coverUrl: "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/741f4b5f-f8bd-4340-fe7d-69d39daf5500/public",
        duration: "02:11",
        bpm: tempo.split(" ")[0] || "132",
        energy: "94%",
        tags: ["electronic", "indobounce", "festival"],
      },
      {
        id: "mix-b",
        label: `Mix B • ${songTitle} (Heavy XXL Drop)`,
        sublabel: "Sub-bass 808 overdriven ekstra tebal untuk dancefloor booster",
        url: audioPair[1],
        coverUrl: "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/cb2ddde0-7994-452e-3ff7-c9162fbfd500/public",
        duration: "02:11",
        bpm: tempo.split(" ")[0] || "132",
        energy: "98%",
        tags: ["electronic", "hard-drop", "bass"],
      },
    ];

    return NextResponse.json({
      success: true,
      isDemo: true,
      title: songTitle,
      genre,
      bpm: tempo,
      description: `Diramu dengan Sound Lab Studio Engine. Style ${artistReference} dengan aransemen ${dropIntensity} drop.`,
      audioUrl: audioPair[0],
      audioUrls: audioPair,
      trackItems,
      coverUrl: "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/741f4b5f-f8bd-4340-fe7d-69d39daf5500/public",
      transactionId: _internalTransactionId || null,
      engine: isSandbox ? "XXL Sandbox Studio Master" : "XXL AI Neural Engine",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memulai pembuatan lagu: " + error.message },
      { status: 500 }
    );
  }
}

function generateEdmTitle(genre, artist) {
  const prefixes = ["XXL", "Cyber", "Midnight", "Tokyo", "Jakarta", "Neon", "Overdrive", "Pulse", "Rave", "Dynamite"];
  const nouns = ["Bounce", "Bassline", "Drop", "Anthem", "Overload", "Horizon", "Drift", "Frequency", "Echo", "Blast"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomPrefix} ${randomNoun} (${genre} VIP Mix)`;
}
