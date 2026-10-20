"use client";

import React, { useState, useEffect } from "react";
import { Zap, Activity, MessageCircle, Sliders, CheckCircle2 } from "lucide-react";

export default function Header({ isSandbox, setIsSandbox }) {
  const [systemStatus, setSystemStatus] = useState({ ok: true, latency: 42 });

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/system/status");
        if (res.ok) {
          const data = await res.json();
          setSystemStatus({ ok: data.ok, latency: data.latencyMs || 38 });
        }
      } catch (e) {
        // Fallback
      }
    }
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-obsidian-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-neon shadow-neon text-obsidian-950 font-black text-xl">
            🍗
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-white">
                XXL<span className="text-lime-neon">CHICKEN</span>
              </span>
              <span className="rounded-full bg-lime-neon/10 px-2 py-0.5 text-[10px] font-bold text-lime-neon border border-lime-neon/30">
                SOUND LAB
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Crispy Beats, Extra-Large Bass
            </p>
          </div>
        </div>

        {/* Center / Right Control Panel */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/[0.06] bg-obsidian-900 px-3 py-1 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-neon opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-neon"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              AI CLUSTER: <span className="text-white font-semibold">ONLINE ({systemStatus.latency}ms)</span>
            </span>
          </div>

          {/* Sandbox Toggle Pill */}
          <button
            onClick={() => setIsSandbox(!isSandbox)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${
              isSandbox
                ? "bg-lime-neon/15 border-lime-neon text-lime-neon shadow-[0_0_15px_rgba(212,255,0,0.2)]"
                : "bg-obsidian-900 border-white/[0.1] text-slate-400 hover:text-white"
            }`}
            title="Klik untuk mengaktifkan/menonaktifkan mode bypass pembayaran QRIS"
          >
            <Zap className={`h-3.5 w-3.5 ${isSandbox ? "fill-lime-neon text-lime-neon" : ""}`} />
            <span>Sandbox Mode:</span>
            <span className={`font-bold ${isSandbox ? "text-lime-neon" : "text-slate-500"}`}>
              {isSandbox ? "ON (Bypass QRIS)" : "OFF"}
            </span>
          </button>

          {/* VIP Support Link */}
          <a
            href="https://wa.me/6288980819445?text=Halo%20XXLCHICKEN%20Sound%20Lab%2C%20mau%20request%20custom%20track%20EDM%20dong"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/[0.1] hover:text-white border border-white/[0.08]"
          >
            <MessageCircle className="h-3.5 w-3.5 text-lime-neon" />
            <span>WA VIP</span>
          </a>
        </div>
      </div>
    </header>
  );
}
