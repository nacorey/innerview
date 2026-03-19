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
                ? "bg-gradient-to-br from-[#F39C12] to-[#E67E22] border-[#E67E22] text-white font-bold"
                : "bg-[#f8f9fa] border-[#dee2e6] text-[#495057] font-medium hover:bg-[#e9ecef]"
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
