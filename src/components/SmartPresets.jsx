import React from "react";
import { CRISPY_PRESETS } from "@/data/edmCatalog";
import { Flame, Play } from "lucide-react";

export default function SmartPresets({ onSelectPreset, selectedPresetId }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-lime-neon" />
          <h2 className="text-sm font-bold tracking-wide uppercase text-slate-300">
            Crispy Presets (Pilih Siap Pakai)
          </h2>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Klik untuk langsung isi parameter otomatis
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {CRISPY_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              type="button"
              className={`group relative flex flex-col justify-between rounded-2xl p-4 text-left transition-all duration-200 border ${
                isSelected
                  ? "bg-obsidian-800 border-lime-neon shadow-[0_0_20px_rgba(212,255,0,0.25)] ring-1 ring-lime-neon"
                  : "bg-obsidian-900/80 border-white/[0.07] hover:border-lime-neon/50 hover:bg-obsidian-800/90"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-lime-neon border border-lime-neon/20">
                    {preset.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {preset.genre}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-lime-neon transition-colors">
                  {preset.title}
                </h3>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.05]">
                <span className="text-[10px] font-mono text-slate-500">
                  {preset.tempo.split(" ")[0]} BPM
                </span>
                <span className={`text-[11px] font-bold ${isSelected ? "text-lime-neon" : "text-slate-400 group-hover:text-white"}`}>
                  {isSelected ? "✓ Aktif" : "Gunakan →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
