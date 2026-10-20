import { NextResponse } from 'next/server';

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
      _internalTransactionId,
    } = body;

    const apiKey = process.env.GOAPI_KEY || process.env.UDIO_API_KEY;
    const songTitle = title.trim() || generateEdmTitle(genre, artistReference);

    // If GoAPI key is available, call Udio (music-u) model
    if (apiKey) {
      console.log("[GoAPI Udio] Triggering music generation task with model: music-u...");
      
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
            lyrics: isInstrumental ? "" : (lyrics || `[Intro]\nLampu neon menyala\n\n[Build-Up]\nAre you ready for the drop?\n3... 2... 1... GO!\n\n[DROP]\n(Crispy XXL Bass Drop)`),
            lyrics_type: isInstrumental ? "instrumental" : (lyrics ? "user" : "generate"),
            negative_tags: isInstrumental ? "vocals, singing" : "",
            seed: -1,
          },
        }),
      });

      const taskData = await createResponse.json();
      console.log("[GoAPI Task Created]", taskData);

      if (!createResponse.ok || taskData.code !== 200) {
        throw new Error(taskData.message || "Gagal membuat task di GoAPI Udio.");
      }

      const taskId = taskData.data?.task_id;
      if (!taskId) {
        throw new Error("Task ID tidak diterima dari GoAPI.");
      }

      // Polling task until completed (up to 75 seconds)
      const maxRetries = 25;
      let completedOutput = null;

      for (let i = 0; i < maxRetries; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        
        const pollRes = await fetch(`https://api.goapi.ai/api/v1/task/${taskId}`, {
          headers: {
            "X-API-Key": apiKey,
            "Authorization": `Bearer ${apiKey}`,
          },
        });
        
        if (pollRes.ok) {
          const pollData = await pollRes.json();
          const status = pollData.data?.status?.toLowerCase();
          console.log(`[GoAPI Polling #${i+1}] Status: ${status}`);

          if (status === "completed" || status === "success") {
            completedOutput = pollData.data?.output;
            break;
          } else if (status === "failed" || status === "error") {
            throw new Error(pollData.data?.error || "Proses generate di Udio gagal.");
          }
        }
      }

      if (!completedOutput) {
        throw new Error("Waktu generate Udio melebihi batas (timeout). Silakan coba lagi.");
      }

      // Udio generates 2 song variations
      const songs = completedOutput.songs || [];
      const track1Url = songs[0]?.audio_url || completedOutput.audio_url || songs[0]?.url;
      const track2Url = songs[1]?.audio_url || songs[1]?.url || track1Url;

      const trackItems = [
        {
          id: "mix-a",
          label: "Mix A • Crispy Bouncy Drop (Udio AI)",
          sublabel: "Fokus pada hook melodis & ketukan ritmis renyah",
          url: track1Url,
          duration: "02:10",
          bpm: tempo.split(" ")[0] || "130",
          energy: "94%",
        },
        {
          id: "mix-b",
          label: "Mix B • Heavy XXL Bass Drop (Udio AI)",
          sublabel: "Sub-bass overdriven ekstra tebal untuk festival banger",
          url: track2Url,
          duration: "02:10",
          bpm: tempo.split(" ")[0] || "130",
          energy: "98%",
        },
      ];

      return NextResponse.json({
        success: true,
        title: songTitle,
        genre,
        bpm: tempo,
        description: `Diramu langsung dengan Udio AI (via GoAPI). Style ${artistReference} dengan aransemen ${dropIntensity} drop.`,
        audioUrl: track1Url,
        audioUrls: [track1Url, track2Url],
        trackItems,
        transactionId: _internalTransactionId || null,
        generatedAt: new Date().toISOString(),
        engine: "Udio AI (music-u)",
      });
    }

    // Fallback if no API Key is configured yet (demo & preview mode)
    console.log("[Info] No GOAPI_KEY configured. Using high-fidelity demo stems.");
    const trackDatabase = {
      "Indobounce": [
        "https://tempfile.aiquickdraw.com/r/1e0461e9-5b44-4959-89db-27fd2c1840f2.mp3",
        "https://tempfile.aiquickdraw.com/r/2a909824-ef60-4ddf-8c74-16ff66cf9d9d.mp3",
      ],
      "Drift Phonk": [
        "https://tempfile.aiquickdraw.com/r/97ce817d-d4d0-4d6a-8de7-4a9b850c2fc0.mp3",
        "https://tempfile.aiquickdraw.com/r/bec2c050-c666-4ad1-bed4-529098d530a3.mp3",
      ],
      "Slap House": [
        "https://tempfile.aiquickdraw.com/r/bec2c050-c666-4ad1-bed4-529098d530a3.mp3",
        "https://tempfile.aiquickdraw.com/r/4a89a4e5-bdf8-4812-b404-bffc453b345b.mp3",
      ],
      "default": [
        "https://tempfile.aiquickdraw.com/r/1e0461e9-5b44-4959-89db-27fd2c1840f2.mp3",
        "https://tempfile.aiquickdraw.com/r/97ce817d-d4d0-4d6a-8de7-4a9b850c2fc0.mp3",
      ],
    };

    const matchedAudio = trackDatabase[genre] || trackDatabase["default"];
    const trackItems = [
      {
        id: "mix-a",
        label: "Mix A • Crispy Bouncy Drop",
        sublabel: "Fokus pada hook melodis & ketukan ritmis renyah",
        url: matchedAudio[0],
        duration: "02:45",
        bpm: tempo.split(" ")[0] || "130",
        energy: "92%",
      },
      {
        id: "mix-b",
        label: "Mix B • Heavy XXL Bass Drop",
        sublabel: "Sub-bass 808 overdriven ekstra tebal untuk festival banger",
        url: matchedAudio[1] || matchedAudio[0],
        duration: "03:10",
        bpm: tempo.split(" ")[0] || "130",
        energy: "98%",
      },
    ];

    return NextResponse.json({
      success: true,
      title: songTitle,
      genre,
      bpm: tempo,
      description: `Diramu dengan Sound Lab Engine. Style ${artistReference} dengan aransemen ${dropIntensity} drop.`,
      audioUrl: trackItems[0].url,
      audioUrls: [trackItems[0].url, trackItems[1].url],
      trackItems,
      transactionId: _internalTransactionId || null,
      generatedAt: new Date().toISOString(),
      engine: "Preview Demo Engine",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal meracik lagu dengan Udio AI. Silakan coba kembali.", details: error.message },
      { status: 500 }
    );
  }
}

function generateEdmTitle(genre, artist) {
  const prefixes = ["XXL", "Cyber", "Midnight", "Tokyo", "Jakarta", "Neon", "Overdrive", "Pulse", "Rave"];
  const nouns = ["Bounce", "Bassline", "Drop", "Anthem", "Overload", "Horizon", "Drift", "Frequency", "Echo"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomPrefix} ${randomNoun} (${genre} VIP Edit)`;
}
