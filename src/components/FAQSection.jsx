"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Zap, Disc3 } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "01 Berapa lama proses pembuatan lagu EDM sampai selesai?",
      badge: "⚡ 60 Detik",
      a: "Sangat instan! Begitu pembayaran QRIS selesai diverifikasi atau kamu menggunakan Sandbox Mode, sistem AI studio kami langsung meracik 2 versi lagu full dengan drop berenergi tinggi dalam waktu kurang dari 60 detik. Kamu bisa langsung memutar, beralih antara Mix A/B, dan mengunduh MP3.",
    },
    {
      q: "02 Apakah lagu yang dihasilkan 100% bebas hak cipta & boleh dipakai komersial?",
      badge: "🛡️ Bebas Hak Cipta",
      a: "Ya! Semua lagu yang dibuat melalui XXLCHICKEN Sound Lab adalah hasil kreasi AI orisinal dan bebas royalti (Royalty-Free). Kamu bebas menggunakannya untuk YouTube, TikTok/Reels, DJ set, backsound restoran, iklan brand, maupun event komersial.",
    },
    {
      q: "03 Apa bedanya Mix A dan Mix B yang didapatkan?",
      badge: "🎁 2 Versi Drop",
      a: "Dengan Rp10.000, kamu otomatis mendapatkan 2 aransemen unik: Mix A difokuskan pada hook melodis yang renyah (Crispy & Bouncy), sementara Mix B difokuskan pada frekuensi sub-bass 808 yang lebih tebal dan distorsi punchy (Heavy XXL Bass Drop).",
    },
    {
      q: "04 Bisakah membuat lagu instrumental tanpa vokal sama sekali?",
      badge: "🎧 Pure Club Banger",
      a: "Sangat bisa! Pada pilihan 'Tipe Vokal', pilih opsi 'Pure Club Banger (No Vocals)'. AI kami akan secara khusus memfokuskan aransemen pada synth build-up, drum fill, dan drop instrumental yang menggelegar.",
    },
    {
      q: "05 Bagaimana jika nomor WhatsApp saya belum menerima file lagu?",
      badge: "💬 CS 24/7",
      a: "Jangan khawatir! File lagu kamu selalu tersimpan di halaman web dan bisa diunduh langsung lewat tombol 'Download MP3'. Jika WhatsApp belum masuk karena jaringan, kamu bisa langsung chat CS kami dengan menyertakan Order ID.",
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-lime-neon mb-2">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>TANYA JAWAB POPULER</span>
        </div>
        <h2 className="text-2xl font-black text-white sm:text-3xl tracking-tight">
          Punya Pertanyaan Seputar XXL Sound Lab?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Segala hal mengenai legalitas komersial, kualitas audio master, dan proses instan.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? "bg-obsidian-900 border-lime-neon/40 shadow-neon"
                  : "bg-obsidian-950/70 border-white/[0.06] hover:border-white/[0.12]"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                type="button"
                className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{faq.q}</span>
                  <span className="hidden sm:inline-block rounded-md bg-lime-neon/10 border border-lime-neon/20 px-2 py-0.5 text-[10px] font-bold text-lime-neon">
                    {faq.badge}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    isOpen ? "rotate-180 text-lime-neon" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-xs text-slate-300 leading-relaxed border-t border-white/[0.04] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
