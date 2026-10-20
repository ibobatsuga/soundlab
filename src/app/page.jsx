"use client";

import React, { useState, useRef } from "react";
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
  const [isSandbox, setIsSandbox] = useState(true); // Default to Sandbox ON for instant test
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
      setLoadingMessage("Menyiapkan transaksi order...");

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

      if (isSandbox) {
        // Direct bypass in sandbox mode or prompt modal with instant button
        setIsQRISOpen(true);
      } else {
        setIsQRISOpen(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (txId) => {
    setIsQRISOpen(false);
    setIsLoading(true);

    const progressSteps = [
      "Membangun pondasi sub-bass 808 dan frequency response...",
      "Menyiapkan build-up riser, synth sweep, dan snare roll...",
      "Menyelaraskan vokal chops dengan groove drum ritmis...",
      "Meracik Mix A (Crispy Bouncy Drop) & Mix B (Heavy XXL Bass Drop)...",
      "Final mastering audio dan mengompilasi file MP3...",
    ];

    let stepIndex = 0;
    setLoadingMessage(progressSteps[0]);
    const stepInterval = setInterval(() => {
      stepIndex += 1;
      if (stepIndex < progressSteps.length) {
        setLoadingMessage(progressSteps[stepIndex]);
      }
    }, 1200);

    try {
      const res = await fetch("/api/music/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValues,
          _internalTransactionId: txId,
        }),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses musik.");
      }

      setResult(data);
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    } catch (err) {
      clearInterval(stepInterval);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
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
