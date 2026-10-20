"use client";

import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import SmartPresets from "@/components/SmartPresets";
import DemoSamples from "@/components/DemoSamples";
import GeneratorForm from "@/components/GeneratorForm";
import NeonAudioPlayer from "@/components/NeonAudioPlayer";
import QRISModal from "@/components/QRISModal";
import FAQSection from "@/components/FAQSection";
import { CRISPY_PRESETS } from "@/data/edmCatalog";

export default function Home() {
  const [isSandbox, setIsSandbox] = useState(true); // Default to Sandbox ON for instant zero-friction testing
  const [selectedPresetId, setSelectedPresetId] = useState(CRISPY_PRESETS[0].id);
  
  const [formValues, setFormValues] = useState({
    genre: CRISPY_PRESETS[0].genre,
    artistReference: CRISPY_PRESETS[0].artistReference,
    vocalType: CRISPY_PRESETS[0].vocalType,
    dropIntensity: CRISPY_PRESETS[0].dropIntensity,
    tempo: CRISPY_PRESETS[0].tempo,
    lyrics: CRISPY_PRESETS[0].lyricsPlaceholder,
    phoneNumber: "081234567890",
  });

  const [transaction, setTransaction] = useState(null);
  const [isQRISOpen, setIsQRISOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [result, setResult] = useState(null);

  const generatorRef = useRef(null);
  const resultRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Clean up polling interval if component unmounts
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setFormValues((prev) => ({
      ...prev,
      genre: preset.genre,
      artistReference: preset.artistReference,
      vocalType: preset.vocalType,
      dropIntensity: preset.dropIntensity,
      tempo: preset.tempo,
      lyrics: preset.lyricsPlaceholder,
    }));
    if (generatorRef.current) {
      generatorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    const cleanPhone = formValues.phoneNumber.trim().replace(/^0/, "62");
    if (!/^62\d{8,13}$/.test(cleanPhone)) {
      alert("Format nomor WhatsApp tidak valid.\nGunakan format aktif (contoh: 08123456789 atau 628123456789).");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage("Menyiapkan invoice QRIS...");

      const res = await fetch("/api/transaction/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValues,
          phoneNumber: cleanPhone,
          isSandbox,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat transaksi.");
      }

      setTransaction(data);
      setIsQRISOpen(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (txId) => {
    setIsQRISOpen(false);
    setIsLoading(true);

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    setLoadingMessage("Menginisialisasi pipeline audio XXL...");

    try {
      const res = await fetch("/api/music/create-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValues,
          isSandbox,
          _internalTransactionId: txId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If GoAPI returned 400 (e.g. credit limit or invalid params)
        const errMsg = data.error || "Gagal memulai tugas pembuatan lagu di server.";
        const wantFallback = confirm(
          `⚠️ Laporan Node Audio:\n${errMsg}\n\nApakah Anda ingin memuat aransemen Master Studio Preview XXLCHICKEN sekarang?`
        );
        if (wantFallback) {
          loadFallbackMaster(data.title || "XXL Banger (Studio Master)");
          return;
        } else {
          setIsLoading(false);
          return;
        }
      }

      // Case 1: Instant Demo / Sandbox Mode
      if (data.isDemo) {
        const demoSteps = [
          "Membangun pondasi sub-bass 808 dan frequency response...",
          "Menyiapkan build-up riser, synth sweep, dan snare roll...",
          "Menyelaraskan vokal chops dengan groove drum ritmis...",
          "Final mastering audio dan kompilasi 24-bit...",
        ];
        let idx = 0;
        setLoadingMessage(demoSteps[0]);
        const stepInterval = setInterval(() => {
          idx += 1;
          if (idx < demoSteps.length) {
            setLoadingMessage(demoSteps[idx]);
          } else {
            clearInterval(stepInterval);
            setResult(data);
            setIsLoading(false);
            setTimeout(() => {
              if (resultRef.current) {
                resultRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }, 250);
          }
        }, 600);
        return;
      }

      // Case 2: Real Udio Task via GoAPI - Start Client-Side Polling
      if (data.taskId) {
        const taskId = data.taskId;
        const taskTitle = data.title;
        const taskGenre = data.genre;
        const taskBpm = data.bpm;

        let elapsedSeconds = 0;
        const pollIntervalMs = 4500;
        const maxWaitSeconds = 600; // 10 minutes max

        setLoadingMessage("Terhubung ke Udio AI (music-u)... Task ID: " + taskId.slice(0, 8));

        pollingIntervalRef.current = setInterval(async () => {
          elapsedSeconds += Math.round(pollIntervalMs / 1000);

          // Dynamic descriptive status updates
          if (elapsedSeconds < 20) {
            setLoadingMessage(`Mengunggah blueprint prompt ke Neural Node Udio... (${elapsedSeconds}s)`);
          } else if (elapsedSeconds < 60) {
            setLoadingMessage(`Meracik bassline ${taskGenre} & harmoni synth drop... (${elapsedSeconds}s)`);
          } else if (elapsedSeconds < 120) {
            setLoadingMessage(`Melakukan sintesis vokal AI & stereo multi-layer... (${elapsedSeconds}s)`);
          } else if (elapsedSeconds < 240) {
            setLoadingMessage(`Rendering dual mix (Mix A Bouncy & Mix B Heavy Drop)... (${elapsedSeconds}s)`);
          } else {
            setLoadingMessage(`Tahap final kompilasi audio 24-bit di Udio cluster... (${elapsedSeconds}s)`);
          }

          try {
            const statusUrl = `/api/music/task-status?taskId=${encodeURIComponent(taskId)}&title=${encodeURIComponent(taskTitle)}&genre=${encodeURIComponent(taskGenre)}&bpm=${encodeURIComponent(taskBpm)}`;
            const pollRes = await fetch(statusUrl);
            if (!pollRes.ok) return; // Keep retrying on network jitter

            const pollData = await pollRes.json();

            if (pollData.status === "completed") {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
              setResult(pollData);
              setIsLoading(false);
              setTimeout(() => {
                if (resultRef.current) {
                  resultRef.current.scrollIntoView({ behavior: "smooth" });
                }
              }, 300);
            } else if (pollData.status === "failed") {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
              setIsLoading(false);
              alert("Pembuatan lagu di Udio AI gagal: " + (pollData.error || "Unknown node error"));
            }
          } catch (pollErr) {
            console.warn("Polling jitter, will retry...", pollErr);
          }

          if (elapsedSeconds >= maxWaitSeconds) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            setIsLoading(false);
            alert("Batas waktu generate Udio AI (10 menit) terlampaui. Silakan coba kembali atau gunakan mode Studio Demo.");
          }
        }, pollIntervalMs);
      }
    } catch (err) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      setIsLoading(false);
      alert("Kesalahan sistem: " + err.message);
    }
  };

  const loadFallbackMaster = (songTitle) => {
    const audioPair = [
      "https://storage.theapi.app/audio/udio/20261020/44bb52bd-ee60-4470-9a75-bae865abcc5e.mp3",
      "https://storage.theapi.app/audio/udio/20261020/4c3a6e83-7d21-4d38-b434-56a857ce943b.mp3",
    ];
    setResult({
      success: true,
      title: songTitle,
      genre: formValues.genre,
      bpm: formValues.tempo,
      audioUrl: audioPair[0],
      audioUrls: audioPair,
      coverUrl: "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/741f4b5f-f8bd-4340-fe7d-69d39daf5500/public",
      trackItems: [
        {
          id: "mix-a",
          label: `Mix A • ${songTitle} (Crispy Bouncy Drop)`,
          sublabel: "Fokus pada hook vokal melodis & punchy drop festival",
          url: audioPair[0],
          coverUrl: "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/741f4b5f-f8bd-4340-fe7d-69d39daf5500/public",
          duration: "02:11",
          bpm: formValues.tempo.split(" ")[0] || "132",
          energy: "94%",
          tags: ["electronic", "indobounce", "festival"],
        },
        {
          id: "mix-b",
          label: `Mix B • ${songTitle} (Heavy XXL Drop)`,
          sublabel: "Sub-bass 808 overdriven ekstra tebal untuk festival banger",
          url: audioPair[1],
          coverUrl: "https://imagedelivery.net/C9yUr1FL21Q6JwfYYh2ozQ/cb2ddde0-7994-452e-3ff7-c9162fbfd500/public",
          duration: "02:11",
          bpm: formValues.tempo.split(" ")[0] || "132",
          energy: "98%",
          tags: ["electronic", "hard-drop", "bass"],
        },
      ],
      engine: "XXL Studio Master Stems",
    });
    setIsLoading(false);
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 250);
  };

  const handleRedeemToken = (txId) => {
    handlePaymentSuccess(txId);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Header isSandbox={isSandbox} setIsSandbox={setIsSandbox} />
        
        <main>
          <HeroBanner />

          {/* Crispy Presets Section */}
          <SmartPresets
            onSelectPreset={handleSelectPreset}
            selectedPresetId={selectedPresetId}
          />

          {/* Real Audio Demos Section */}
          <DemoSamples />

          {/* Generator & Player Main Section */}
          <section ref={generatorRef} className="mx-auto max-w-4xl px-4 py-8">
            {/* Show Neon Audio Player when result is ready */}
            {result && (
              <div ref={resultRef} className="mb-10">
                <NeonAudioPlayer
                  result={result}
                  onReset={() => {
                    setResult(null);
                    if (generatorRef.current) {
                      generatorRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                />
              </div>
            )}

            {/* Generator Form */}
            <GeneratorForm
              formValues={formValues}
              setFormValues={setFormValues}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              isSandbox={isSandbox}
              onRedeemToken={handleRedeemToken}
            />
          </section>

          {/* FAQ Section */}
          <FAQSection />
        </main>
      </div>

      {/* QRIS Modal */}
      <QRISModal
        transaction={transaction}
        isOpen={isQRISOpen}
        onClose={() => setIsQRISOpen(false)}
        onSuccess={handlePaymentSuccess}
        isSandbox={isSandbox}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-obsidian-950/80 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lime-neon font-black text-sm">🍗 XXLCHICKEN SOUND LAB</span>
            <span>• Studio Musik Electronic & EDM AI Indonesia</span>
          </div>
          <div>
            Standar Pembayaran QRIS Nasional • Dukungan WhatsApp 24/7
          </div>
        </div>
      </footer>
    </div>
  );
}
