"use client";

import React, { useState, useEffect } from "react";
import { X, QrCode, Clock, ShieldCheck, Zap, AlertCircle } from "lucide-react";

export default function QRISModal({ transaction, isOpen, onClose, onSuccess, isSandbox }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [pollingStatus, setPollingStatus] = useState("Menunggu scan QRIS...");
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!isOpen || !transaction?.transactionId) return;

    setTimeLeft(600);
    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Poll status from /api/transaction/:id
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/transaction/${transaction.transactionId}?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "PAID") {
            clearInterval(pollInterval);
            clearInterval(countdown);
            setPollingStatus("Pembayaran Berhasil! Memulai racik lagu...");
            setTimeout(() => {
              onSuccess(transaction.transactionId);
            }, 800);
          } else {
            setPollingStatus(`Menunggu pembayaran... (Posisi antrean: #${data.queuePosition || 1})`);
          }
        }
      } catch (err) {
        // Continue polling
      }
    }, 2500);

    return () => {
      clearInterval(countdown);
      clearInterval(pollInterval);
    };
  }, [isOpen, transaction, onSuccess]);

  if (!isOpen || !transaction) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch(`/api/transaction/${transaction.transactionId}`, {
        method: "POST",
      });
      if (res.ok) {
        setPollingStatus("⚡ Simulasi Berhasil! Melanjutkan ke generator...");
        setTimeout(() => {
          onSuccess(transaction.transactionId);
        }, 600);
      }
    } catch (e) {
      //
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-lime-neon/40 bg-obsidian-900 p-6 shadow-neon-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-neon text-obsidian-950 font-bold mb-3 shadow-neon">
            <QrCode className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Pembayaran QRIS Instan
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Scan dengan BCA, GoPay, OVO, Dana, ShopeePay, atau m-Banking mana pun.
          </p>
        </div>

        {/* Order Info & Amount Card */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-obsidian-950/90 border border-white/[0.06] p-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">ORDER ID</span>
            <span className="font-mono font-bold text-white">{transaction.orderId || "XXL-78901"}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block text-[10px]">TOTAL BAYAR</span>
            <span className="text-base font-black text-lime-neon font-mono">
              {transaction.amountDisplay || "Rp10.000"}
            </span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl bg-obsidian-950 p-4 border border-white/[0.08]">
          <div className="relative overflow-hidden rounded-xl bg-[#14171d] p-3 border border-lime-neon/30 shadow-inner">
            {transaction.qrUrl ? (
              <img
                src={transaction.qrUrl}
                alt="QRIS Barcode"
                className="h-56 w-56 object-contain rounded-lg"
              />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center text-xs text-slate-500">
                Memuat QR Code...
              </div>
            )}
          </div>

          {/* Countdown & Status */}
          <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-400">
            <Clock className="h-3.5 w-3.5 text-lime-neon" />
            <span>Kadaluarsa dalam: </span>
            <strong className="text-lime-neon text-sm">{timerDisplay}</strong>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-400 animate-pulse text-center">
            {pollingStatus}
          </p>
        </div>

        {/* Sandbox Dev Bypass Button */}
        {isSandbox && (
          <div className="mt-4 rounded-xl border border-yellow-400/40 bg-yellow-400/10 p-3">
            <div className="flex items-center gap-1.5 text-yellow-300 text-xs font-bold mb-1.5">
              <Zap className="h-4 w-4 fill-yellow-400" />
              <span>Sandbox Dev Mode Aktif</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2">
              Kamu bisa mensimulasikan pembayaran selesai langsung tanpa perlu scan QRIS asli:
            </p>
            <button
              onClick={handleSimulatePayment}
              disabled={isSimulating}
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-neon py-2.5 text-xs font-black uppercase text-obsidian-950 shadow-neon hover:bg-yellow-300 transition-all"
            >
              <Zap className="h-4 w-4" />
              <span>{isSimulating ? "Memproses..." : "⚡ SIMULASIKAN BAYAR SUKSES (DEV BYPASS)"}</span>
            </button>
          </div>
        )}

        {/* Security Footer */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Standar QRIS Nasional • Pembayaran Otomatis Terverifikasi</span>
        </div>
      </div>
    </div>
  );
}
