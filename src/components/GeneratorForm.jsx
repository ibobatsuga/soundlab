"use client";

import React, { useState, useEffect } from "react";
import {
  EDM_GENRES,
  ARTIST_REFERENCES,
  VOCAL_TYPES,
  DROP_INTENSITIES,
  TEMPO_RANGES,
} from "@/data/edmCatalog";
import {
  Sliders,
  Sparkles,
  Phone,
  Flame,
  Wand2,
  Dice5,
  Tag,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function GeneratorForm({
  formValues,
  setFormValues,
  onSubmit,
  isLoading,
  loadingMessage,
  isSandbox,
  onRedeemToken,
}) {
  const [tokenInput, setTokenInput] = useState("");
  const [tokenMsg, setTokenMsg] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  const availableArtists = ARTIST_REFERENCES[formValues.genre] || [
    "Martin Garrix",
    "Alok",
    "Whisnu Santika",
    "Kordhell",
  ];

  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInsertTag = (tag) => {
    const current = formValues.lyrics || "";
    const spacing = current.length > 0 && !current.endsWith("\n") ? "\n\n" : "";
    handleFieldChange("lyrics", current + spacing + tag + "\n");
  };

  const handleRandomLyrics = () => {
    const samples = [
      "[Intro]\nLampu sorot mulai menyala terang\nSemua kumpul di tengah lapangan\n\n[Build-Up]\nJangan cuma diam, angkat kedua tanganmu!\nSatu... Dua... Tiga... LET'S GO!\n\n[DROP - CRISPY BASSLINE]\n(Bouncing kicks & heavy 808 drop!)\n\n[Outro]\nXXL Sound Lab, play it loud!",
      "[Verse]\nMidnight speed on the highway\nTokyo neon lights shining bright\n\n[Build-Up]\nCan you hear the engine screaming?\n3... 2... 1... FLOOR IT!\n\n[DROP - AGGRESSIVE PHONK 808]\n(Cowbell distortion & punchy kick!)\n\n[Outro]\nDrift away till morning.",
      "[Verse]\nLate night vibes under the club light\nBassline pulsing through the night\n\n[Build-Up]\nFeel the drop rising up high\nGet ready for the bounce!\n\n[SLAP BASS DROP]\n(Crispy pluck bassline!)\n\n[Outro]\nXXL Chicken Beat on repeat.",
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    handleFieldChange("lyrics", picked);
  };

  const handleRedeem = async () => {
    if (!tokenInput.trim()) return;
    setTokenLoading(true);
    setTokenMsg(null);
    try {
      const res = await fetch("/api/transaction/redeem-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setTokenMsg({ success: true, message: data.message });
        if (data.promptData) {
          setFormValues((prev) => ({ ...prev, ...data.promptData }));
        }
        onRedeemToken(data.transactionId);
      } else {
        setTokenMsg({ success: false, message: data.error || "Token tidak valid." });
      }
    } catch (e) {
      setTokenMsg({ success: false, message: "Gagal memproses token." });
    } finally {
      setTokenLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-obsidian-900/90 p-5 sm:p-7 backdrop-blur-xl shadow-card">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Step 1: Music Style & EDM Subgenre */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/[0.06]">
            <Sliders className="h-5 w-5 text-lime-neon" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Langkah 1: Tentukan Vibe & Karakter Electronic Drop
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Genre Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Subgenre EDM / Electronic <span className="text-lime-neon">*</span>
              </label>
              <select
                value={formValues.genre}
                onChange={(e) => {
                  const newGenre = e.target.value;
                  handleFieldChange("genre", newGenre);
                  const artists = ARTIST_REFERENCES[newGenre] || [];
                  if (artists.length > 0) {
                    handleFieldChange("artistReference", artists[0]);
                  }
                }}
                className="w-full rounded-xl border border-white/[0.1] bg-obsidian-950 px-3.5 py-2.5 text-sm text-white focus:border-lime-neon focus:outline-none focus:ring-1 focus:ring-lime-neon transition-all"
              >
                {EDM_GENRES.map((g) => (
                  <option key={g} value={g} className="bg-obsidian-900">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Artist / Producer Reference */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Referensi Gaya Producer / Artis
              </label>
              <select
                value={formValues.artistReference}
                onChange={(e) => handleFieldChange("artistReference", e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-obsidian-950 px-3.5 py-2.5 text-sm text-white focus:border-lime-neon focus:outline-none focus:ring-1 focus:ring-lime-neon transition-all"
              >
                {availableArtists.map((a) => (
                  <option key={a} value={a} className="bg-obsidian-900">
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vocal Style Selector */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tipe Vokal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {VOCAL_TYPES.map((v) => {
                const isSelected = formValues.vocalType === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleFieldChange("vocalType", v.id)}
                    className={`flex flex-col text-left rounded-xl p-3 border transition-all ${
                      isSelected
                        ? "bg-lime-neon/[0.12] border-lime-neon text-white ring-1 ring-lime-neon"
                        : "bg-obsidian-950/70 border-white/[0.06] text-slate-400 hover:border-white/[0.15] hover:text-slate-200"
                    }`}
                  >
                    <span className="text-xs font-bold text-white">{v.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">{v.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drop Intensity & Tempo BPM */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Karakter Drop & Bassline
              </label>
              <select
                value={formValues.dropIntensity}
                onChange={(e) => handleFieldChange("dropIntensity", e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-obsidian-950 px-3.5 py-2.5 text-sm text-white focus:border-lime-neon focus:outline-none"
              >
                {DROP_INTENSITIES.map((d) => (
                  <option key={d.id} value={d.id} className="bg-obsidian-900">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kecepatan Tempo (BPM)
              </label>
              <select
                value={formValues.tempo}
                onChange={(e) => handleFieldChange("tempo", e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-obsidian-950 px-3.5 py-2.5 text-sm text-white focus:border-lime-neon focus:outline-none"
              >
                {TEMPO_RANGES.map((t) => (
                  <option key={t.id} value={t.label} className="bg-obsidian-900">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Lyrics & Hook Builder */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-lime-neon" />
              <h3 className="text-base font-bold text-white tracking-wide">
                Langkah 2: Cerita, Lirik, atau Ide Hook Drop
              </h3>
            </div>
            <button
              type="button"
              onClick={handleRandomLyrics}
              className="flex items-center gap-1 rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Dice5 className="h-3.5 w-3.5 text-lime-neon" />
              <span>Contoh Acak</span>
            </button>
          </div>

          {/* Quick Structure Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <Tag className="h-3 w-3" /> Insert Tag:
            </span>
            {["+[Intro]", "+[Build-Up]", "+[DROP]", "+[Breakdown]", "+[HEAVY DROP]", "+[Outro]"].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleInsertTag(tag)}
                  className="rounded-md bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-slate-300 hover:border-lime-neon hover:text-lime-neon transition-colors"
                >
                  {tag}
                </button>
              )
            )}
          </div>

          <textarea
            rows={5}
            value={formValues.lyrics}
            onChange={(e) => handleFieldChange("lyrics", e.target.value)}
            placeholder="Tulis lirik lengkap atau cukup ceritakan tema lagumu (contoh: Lagu party ulang tahun di Jakarta, mood high energy, shoutout XXL Chicken renyah...)"
            className="w-full rounded-2xl border border-white/[0.1] bg-obsidian-950 p-4 font-sans text-sm text-white placeholder:text-slate-600 focus:border-lime-neon focus:outline-none focus:ring-1 focus:ring-lime-neon transition-all resize-y"
          />

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>💡 Tip: AI akan otomatis meracik vokal drop yang pas dengan ritme.</span>
            <span className="font-mono">{formValues.lyrics?.length || 0} / 3000 karakter</span>
          </div>
        </div>

        {/* Step 3: WhatsApp Number for Direct Push Delivery */}
        <div>
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06] mb-3">
            <Phone className="h-5 w-5 text-lime-neon" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Langkah 3: Kirim Hasil Track ke WhatsApp
            </h3>
            <span className="rounded-md bg-lime-neon/15 px-2 py-0.5 text-[10px] font-bold text-lime-neon border border-lime-neon/30">
              WAJIB DIISI
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-2">
            Hasil <strong className="text-white">2 versi lagu MP3 kualitas studio</strong> akan langsung dikirimkan ke chat WhatsApp ini begitu selesai! 🚀
          </p>

          <input
            type="text"
            required
            value={formValues.phoneNumber}
            onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
            placeholder="Contoh: 08123456789 atau 628123456789"
            className="w-full rounded-xl border border-white/[0.1] bg-obsidian-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-lime-neon focus:outline-none focus:ring-1 focus:ring-lime-neon transition-all font-mono"
          />
        </div>

        {/* Loading state bar */}
        {isLoading && (
          <div className="rounded-2xl border border-lime-neon/40 bg-lime-neon/10 p-4 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2 text-lime-neon font-bold text-sm mb-1">
              <Zap className="h-4 w-4 animate-spin" />
              <span>SEDANG MERACIK TRACK BANGER...</span>
            </div>
            <p className="text-xs text-slate-300">
              {loadingMessage || "Menyelaraskan drop 808 dan frequency response..."}
            </p>
          </div>
        )}

        {/* Main CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-lime-neon py-4 text-base font-black tracking-wide uppercase text-obsidian-950 shadow-neon-lg hover:bg-yellow-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Flame className="h-5 w-5 fill-obsidian-950" />
          <span>
            {isLoading
              ? "MEMPROSES AUDIO..."
              : isSandbox
              ? "⚡ RACIK SEKARANG (SANDBOX BYPASS)"
              : "⚡ RACIK 2 DROP BANGER SEKARANG (Rp10.000)"}
          </span>
        </button>

        {/* Promo / Retry Token Input */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">Punya Token Promo / Retry?</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Contoh: CRISPYDROP"
              className="rounded-lg border border-white/[0.1] bg-obsidian-950 px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:border-lime-neon focus:outline-none uppercase font-mono"
            />
            <button
              type="button"
              onClick={handleRedeem}
              disabled={tokenLoading}
              className="rounded-lg bg-white/[0.08] px-3 py-1.5 font-bold text-lime-neon hover:bg-lime-neon hover:text-obsidian-950 transition-colors"
            >
              {tokenLoading ? "..." : "Klaim"}
            </button>
          </div>
        </div>

        {tokenMsg && (
          <p className={`text-xs ${tokenMsg.success ? "text-lime-neon" : "text-rose-400"}`}>
            {tokenMsg.message}
          </p>
        )}
      </form>
    </div>
  );
}
