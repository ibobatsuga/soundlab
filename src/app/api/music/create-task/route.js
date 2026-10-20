import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const VOCAL_PROMPTS = {
  female_diva: "female vocalist, clear melodic pop singing, euphoric vocal hook",
  vocoder: "robotic vocoder vocals, autotune vocals, synth vocal chops",
  hype_mc: "hype mc vocal shouts, rap vocal chops, aggressive crowd chanting",
  pitch_deep: "deep pitched male vocal, dark slap house vocal, club vocal chops",
  instrumental: "pure instrumental club banger, no singing, no vocals",
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
      forceDemo = false,
      _internalTransactionId,
    } = body;

    const apiKey = process.env.PIAPI_KEY || process.env.UDIO_API_KEY || process.env.GOAPI_KEY;
    const isPiAPI = Boolean(process.env.PIAPI_KEY);
    const endpoint = isPiAPI ? "https://api.piapi.ai/api/v1/task" : "https://api.goapi.ai/api/v1/task";
    const providerName = isPiAPI ? "PiAPI" : "GoAPI";

    const songTitle = title.trim() || generateEdmTitle(genre, artistReference);

    // If live API key is present and NOT forced into static demo mode
    if (apiKey && !forceDemo) {
      const isInstrumental = vocalType === "instrumental";
      const vocalTag = VOCAL_PROMPTS[vocalType] || "energetic vocals, clear vocal singing";
      
      const promptDescription = isInstrumental
        ? `${genre}, ${tempo}, ${artistReference} style, electronic club festival, ${dropIntensity} drop, punchy kicks, instrumental`
        : `${genre}, ${tempo}, ${artistReference} style, electronic club festival, ${dropIntensity} drop, ${vocalTag}, punchy kicks, crispy sub-bass`;

      // Format custom lyrics: Ensure Udio section tags exist so Udio sings the lyrics
      const formattedLyrics = isInstrumental
        ? ""
        : formatLyricsForUdio(lyrics, genre);

      const payload = {
        model: "music-u",
        task_type: "generate_music",
        input: {
          gpt_description_prompt: promptDescription,
          lyrics: formattedLyrics,
          lyrics_type: isInstrumental ? "instrumental" : (formattedLyrics ? "user" : "generate"),
          negative_tags: isInstrumental ? "vocals, singing, voice, vocal chops" : "",
          seed: -1,
        },
      };

      console.log(`[${providerName} Udio Task] Dispatching with lyrics_type:`, payload.input.lyrics_type);
      console.log(`[Lyrics Content Preview]:`, formattedLyrics ? formattedLyrics.slice(0, 100) + "..." : "[Instrumental]");

      const createResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const taskData = await createResponse.json();

      if (!createResponse.ok || taskData.code !== 200) {
        return NextResponse.json({
          success: false,
          error: taskData.message || `${providerName} Udio menolak task pembuatan lagu.`,
          code: taskData.code || createResponse.status,
          apiErrorDetail: taskData.detail || null,
        }, { status: 400 });
      }

      const taskId = taskData.data?.task_id;
      if (!taskId) {
        return NextResponse.json({
          success: false,
          error: `Task ID tidak diterima dari ${providerName} cluster.`,
        }, { status: 502 });
      }

      return NextResponse.json({
        success: true,
        isDemo: false,
        taskId,
        provider: providerName,
        title: songTitle,
        genre,
        bpm: tempo,
        description: `Diramu via ${providerName} Udio AI (music-u). Style ${artistReference} dengan aransemen ${dropIntensity} drop.`,
        transactionId: _internalTransactionId || null,
        lyricsUsed: formattedLyrics,
      });
    }

    // Static Demo Stems Fallback (Only used if no API Key is available)
    const audioPair = [
      "https://storage.theapi.app/audio/udio/20261020/35353b59-e115-468d-97b8-0eb3acd7fdb7.mp3",
      "https://storage.theapi.app/audio/udio/20261020/6c673fd4-1727-4cdb-af7d-4d821ad5162a.mp3",
    ];

    const trackItems = [
      {
        id: "mix-a",
        label: `Mix A • ${songTitle} (Crispy Bouncy Drop)`,
        sublabel: "Fokus pada hook vokal melodis & punchy drop festival",
        url: audioPair[0],
        coverUrl: "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/99e4c2d3-725d-4913-2b25-70e406f09000/public",
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
        coverUrl: "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/eed99187-6321-41d6-cc37-6141e44e1b00/public",
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
      coverUrl: "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/99e4c2d3-725d-4913-2b25-70e406f09000/public",
      transactionId: _internalTransactionId || null,
      engine: "XXL Studio Master Stems",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memulai pembuatan lagu: " + error.message },
      { status: 500 }
    );
  }
}

function formatLyricsForUdio(rawLyrics, genre) {
  if (!rawLyrics || !rawLyrics.trim()) {
    return `[Intro]\nLampu neon menyala di Jakarta\n\n[Build-Up]\nAre you ready for the drop?\n3... 2... 1... GO!\n\n[DROP]\n(Crispy XXL Bass Drop)`;
  }

  const trimmed = rawLyrics.trim();

  // If user already used standard Udio structural tags like [Verse], [Chorus], [Intro], pass as-is
  if (trimmed.includes("[") && trimmed.includes("]")) {
    return trimmed;
  }

  // If user entered plain text or short sentences, wrap in structured tags so Udio neural vocal synthesizer sings every word
  const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= 4) {
    return `[Chorus]\n${trimmed}\n\n[DROP]\n(Crispy XXL Bass Drop)`;
  }

  const mid = Math.ceil(lines.length / 2);
  const part1 = lines.slice(0, mid).join("\n");
  const part2 = lines.slice(mid).join("\n");

  return `[Verse]\n${part1}\n\n[Chorus]\n${part2}\n\n[DROP]\n(Crispy XXL Bass Drop)`;
}

function generateEdmTitle(genre, artist) {
  const prefixes = ["XXL", "Cyber", "Midnight", "Tokyo", "Jakarta", "Neon", "Overdrive", "Pulse", "Rave", "Dynamite"];
  const nouns = ["Bounce", "Bassline", "Drop", "Anthem", "Overload", "Horizon", "Drift", "Frequency", "Echo", "Blast"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomPrefix} ${randomNoun} (${genre} VIP Mix)`;
}
