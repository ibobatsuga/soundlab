"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Download, Share2, Volume2, Sparkles, RefreshCw, Layers } from "lucide-react";

export default function NeonAudioPlayer({ result, onReset }) {
  const [activeMixIndex, setActiveMixIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const tracks = result?.trackItems || [
    {
      id: "mix-a",
      label: "Mix A • Crispy Bouncy Drop",
      sublabel: "Fokus pada hook melodis & ketukan ritmis renyah",
      url: result?.audioUrls?.[0] || result?.audioUrl,
      duration: "02:45",
      bpm: result?.bpm?.split(" ")?.[0] || "132",
      energy: "92%",
    },
    {
      id: "mix-b",
      label: "Mix B • Heavy XXL Bass Drop",
      sublabel: "Sub-bass 808 overdriven ekstra tebal untuk festival banger",
      url: result?.audioUrls?.[1] || result?.audioUrl,
      duration: "03:10",
      bpm: result?.bpm?.split(" ")?.[0] || "132",
      energy: "98%",
    },
  ];

  const currentTrack = tracks[activeMixIndex] || tracks[0];

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [activeMixIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleShareWA = () => {
    const text = `🔥 Dengerin track EDM baru gue: *"${result?.title || 'XXL Banger'}"*!\nGenre: ${result?.genre || 'EDM'} | Diramu dengan XXLCHICKEN Sound Lab 🍗⚡\n\nLink Audio:\n${currentTrack?.url}\n\n_Bikin lagu club & festival kamu sendiri di XXLCHICKEN Sound Lab!_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="relative rounded-3xl border border-lime-neon/40 bg-obsidian-900/90 p-6 shadow-neon-lg backdrop-blur-xl">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-lime-neon animate-ping" />
          <span className="text-xs font-black tracking-widest uppercase text-lime-neon">
            MASTER AUDIO SIAP DIPUTAR & DIUNDUH
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>GENRE: <strong className="text-white">{result?.genre}</strong></span>
          <span>•</span>
          <span>BPM: <strong className="text-lime-neon">{currentTrack?.bpm}</strong></span>
        </div>
      </div>

      {/* Track Title, Artwork & Description */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {(currentTrack?.coverUrl || result?.coverUrl) && (
          <img
            src={currentTrack?.coverUrl || result?.coverUrl}
            alt="Album Art"
            className="h-20 w-20 rounded-2xl object-cover border border-lime-neon/30 shadow-lg shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-black text-white sm:text-3xl tracking-tight">
            {result?.title}
          </h2>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-2xl">
            {result?.description || "Racikan audio kustom berenergi tinggi dengan pemrosesan frekuensi sub-bass XXL."}
          </p>
        </div>
      </div>

      {/* Dual Deck Mix Selector (Mix A vs Mix B) */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tracks.map((track, idx) => {
          const isActive = activeMixIndex === idx;
          return (
            <button
              key={track.id || idx}
              onClick={() => setActiveMixIndex(idx)}
              className={`flex items-start gap-3 rounded-2xl p-4 text-left transition-all border ${
                isActive
                  ? "bg-lime-neon/[0.12] border-lime-neon shadow-[0_0_20px_rgba(212,255,0,0.25)]"
                  : "bg-obsidian-950/80 border-white/[0.07] hover:border-white/[0.2]"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                  isActive ? "bg-lime-neon text-obsidian-950 shadow-neon" : "bg-white/[0.08] text-slate-400"
                }`}
              >
                {idx === 0 ? "A" : "B"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white truncate">
                    {track.label}
                  </h4>
                  <span className="text-[10px] font-mono text-lime-neon bg-lime-neon/15 px-2 py-0.5 rounded-md font-semibold">
                    ENERGY: {track.energy}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {track.sublabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Waveform Visualizer Section */}
      <div className="mt-6 rounded-2xl bg-obsidian-950/90 border border-white/[0.06] p-5">
        <div className="flex items-end justify-between gap-1 h-20 mb-3 px-2">
          {Array.from({ length: 48 }).map((_, i) => {
            const progress = (i / 48) <= (duration > 0 ? currentTime / duration : 0);
            const heightMultiplier = Math.sin((i / 48) * Math.PI) * 0.7 + 0.3;
            return (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  progress
                    ? "bg-lime-neon shadow-[0_0_8px_rgba(212,255,0,0.8)]"
                    : "bg-slate-800"
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (heightMultiplier * 90) + (Math.sin(i * 1.5 + currentTime * 8) * 20))}%` : `${heightMultiplier * 70}%`,
                }}
              />
            );
          })}
        </div>

        {/* Seekbar */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-neon"
        />

        {/* Time and Playback Controls */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-neon text-obsidian-950 shadow-neon hover:scale-105 active:scale-95 transition-all font-bold"
            >
              {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-0.5" />}
            </button>

            <div>
              <div className="text-sm font-bold text-white font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <div className="text-[11px] text-slate-400">
                Playing: {currentTrack?.label}
              </div>
            </div>
          </div>

          {/* Action Buttons: Download & WhatsApp Share */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/api/music/download?url=${encodeURIComponent(currentTrack?.url || '')}&filename=${encodeURIComponent((result?.title || 'XXL_CHICKEN').replace(/\s+/g, '_') + '_' + (currentTrack?.id || 'track') + '.mp3')}`}
              className="flex items-center gap-2 rounded-xl bg-lime-neon px-4 py-2.5 text-xs font-black uppercase text-obsidian-950 shadow-neon hover:bg-yellow-300 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download MP3</span>
            </a>

            <button
              onClick={handleShareWA}
              type="button"
              className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.1] transition-all"
            >
              <Share2 className="h-4 w-4 text-emerald-400" />
              <span>Kirim ke WhatsApp</span>
            </button>

            <button
              onClick={onReset}
              type="button"
              className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-obsidian-800 px-3 py-2.5 text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Bikin Lagi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
