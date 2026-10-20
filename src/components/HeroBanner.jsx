import React from "react";
import { Sparkles, Radio, Disc3, ShieldCheck } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-8 pb-6 text-center sm:pt-12">
      {/* Background radial gradient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-[800px] rounded-full bg-gradient-to-b from-lime-neon/[0.12] via-emerald-500/[0.04] to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-lime-neon/30 bg-lime-neon/[0.08] px-4 py-1.5 text-xs font-semibold text-lime-neon shadow-[0_0_20px_rgba(212,255,0,0.15)] mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>STUDIO GENERATOR ELECTRONIC & EDM #1 DI INDONESIA</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
          CRISPY BEATS, <br />
          <span className="bg-gradient-to-r from-lime-neon via-yellow-300 to-lime-neon bg-clip-text text-transparent">
            EXTRA-LARGE BASS.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Racik banger <strong className="text-white">Indobounce, Drift Phonk, Slap House, & Hardstyle</strong> dengan lirikmu sendiri. Ditenagai AI khusus frekuensi club & festival. Siap dalam 60 detik!
        </p>

        {/* Feature Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-obsidian-900/90 px-3 py-1.5 font-medium text-slate-300">
            <Disc3 className="h-4 w-4 text-lime-neon animate-spin" style={{ animationDuration: '4s' }} />
            <span>2 Mix Drop per Pesanan</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-obsidian-900/90 px-3 py-1.5 font-medium text-slate-300">
            <Radio className="h-4 w-4 text-emerald-400" />
            <span>Instant Waveform Master</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-obsidian-900/90 px-3 py-1.5 font-medium text-slate-300">
            <ShieldCheck className="h-4 w-4 text-lime-neon" />
            <span>100% Bebas Royalti / Hak Cipta</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-lime-neon/20 bg-lime-neon/10 px-3 py-1.5 font-bold text-lime-neon">
            <span>Rp10.000 • Bayar QRIS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
