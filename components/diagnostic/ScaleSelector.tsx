"use client";

import type { ScaleOption } from "@/lib/types/diagnostic";

interface Props {
  options: ScaleOption[];
  value: number | undefined;
  onChange: (value: number) => void;
}

export function ScaleSelector({ options, value, onChange }: Props) {
  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-[10px] border-[1.5px] py-2.5 px-1 text-xs leading-tight transition-all duration-200 ${
              selected
                ? "bg-gradient-to-br from-amber-brand to-[#E67E22] border-amber-brand text-white font-bold"
                : "bg-surface border-edge text-ink-secondary font-medium hover:bg-surface-sunken"
            }`}
          >
            {opt.emoji && <div className="text-lg mb-0.5">{opt.emoji}</div>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
