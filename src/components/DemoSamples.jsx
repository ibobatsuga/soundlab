"use client";

import React, { useState, useRef } from "react";
import { DEMO_SAMPLES } from "@/data/edmCatalog";
import { Play, Pause, Volume2, Sparkles, Radio } from "lucide-react";

export default function DemoSamples() {
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const audioRef = useRef(null);

  const handlePlayToggle = (sample) => {
    if (currentPlayingId === sample.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(sample.audioUrl);
      newAudio.onended = () => setCurrentPlayingId(null);
      newAudio.play().catch(() => {});
      audioRef.current = newAudio;
      setCurrentPlayingId(sample.id);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      <div className="rounded-3xl border border-white/[0.08] bg-obsidian-900/60 p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-lime-neon" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Dengarkan Kualitas Drop XXL Sound Lab
              </h2>
              <p className="text-xs text-slate-400">
                Sampel audio asli hasil racikan AI Studio spesialis Electronic & EDM
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-lime-neon bg-lime-neon/10 border border-lime-neon/20 px-3 py-1 rounded-full self-start sm:self-auto">
            LIVE PREVIEWS
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_SAMPLES.map((sample) => {
            const isPlaying = currentPlayingId === sample.id;
            return (
              <div
                key={sample.id}
                className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all border ${
                  isPlaying
                    ? "bg-obsidian-800 border-lime-neon shadow-[0_0_20px_rgba(212,255,0,0.2)]"
                    : "bg-obsidian-950/80 border-white/[0.06] hover:border-white/[0.15]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-md bg-white/[0.08] px-2 py-0.5 text-[10px] font-bold text-slate-300">
                      {sample.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {sample.bpm}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    {sample.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                    {sample.description}
                  </p>
                </div>

                {/* Animated Waveform Visualizer & Play Button */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  {/* Dynamic mini waveform bars */}
                  <div className="flex items-end gap-1 h-6">
                    {[40, 70, 95, 60, 85, 45, 100, 30, 80, 50].map((h, idx) => (
                      <span
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlaying
                            ? "bg-lime-neon shadow-[0_0_8px_rgba(212,255,0,0.8)]"
                            : "bg-slate-700"
                        }`}
                        style={{
                          height: isPlaying ? `${Math.max(20, (h * Math.sin(idx + 1)) % 100)}%` : `${h * 0.3}%`,
                          animation: isPlaying ? `barJump ${0.6 + (idx % 4) * 0.2}s ease-in-out infinite` : 'none',
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handlePlayToggle(sample)}
                    type="button"
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all shadow-md ${
                      isPlaying
                        ? "bg-lime-neon text-obsidian-950 shadow-neon"
                        : "bg-white/[0.08] text-white hover:bg-lime-neon hover:text-obsidian-950 hover:shadow-neon"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 fill-current" />
                    ) : (
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
