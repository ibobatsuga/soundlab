"use client";

import React, { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";

export default function WhatsAppSupport() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 group print:hidden">
      {isOpen && (
        <div className="relative animate-bounce-slight max-w-[260px] sm:max-w-[300px] rounded-2xl border border-lime-neon/30 bg-obsidian-900/95 p-3.5 shadow-neon backdrop-blur-xl text-xs">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Tutup pesan"
            className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-obsidian-800 border border-white/[0.1] text-slate-400 hover:text-white text-[10px] font-bold"
          >
            <X className="h-3 w-3" />
          </button>
          
          <div className="flex items-center gap-1.5 font-bold text-lime-neon mb-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-neon opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-neon"></span>
            </span>
            <span>XXL Concierge DJ Ready!</span>
            <span className="ml-auto rounded-full bg-lime-neon/15 px-1.5 py-0.5 text-[9px] font-mono text-lime-neon font-bold">
              Rp 20rb
            </span>
          </div>

          <p className="text-slate-300 leading-snug">
            Mau track EDM terima beres tanpa ribet? Chat kami di WA, request bebas genre langsung jadi!
          </p>

          <a
            href="https://wa.me/6288980819445?text=Halo%20XXLCHICKEN%20Sound%20Lab%2C%20aku%20mau%20bikin%20lagu%20EDM%20terima%20beres%20di%20WhatsApp%20(Rp%2020.000)%20dong%20%E2%9A%A1"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block w-full rounded-xl bg-lime-neon py-1.5 text-center text-xs font-black uppercase text-obsidian-950 shadow-neon hover:bg-yellow-300 transition-all"
          >
            Chat Terima Beres di WA →
          </a>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-neon text-obsidian-950 shadow-neon hover:scale-110 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </aside>
  );
}
