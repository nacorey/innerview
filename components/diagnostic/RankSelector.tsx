"use client";

import type { RankOption, ScaleOption } from "@/lib/types/diagnostic";

interface Props {
  options: RankOption[];
  scaleOptions: ScaleOption[];
  value: Record<string, number> | undefined;
  onChange: (value: Record<string, number>) => void;
}

export function RankSelector({ options, scaleOptions, value, onChange }: Props) {
  const currentValue = value ?? {};
  const usedRanks = new Set(Object.values(currentValue));

  const handleSelect = (channel: string, rank: number) => {
    const next = { ...currentValue };

    // 이미 이 순위를 가진 채널이 있으면 교환
    const existingChannel = Object.entries(next).find(([, r]) => r === rank)?.[0];
    if (existingChannel && existingChannel !== channel) {
      const oldRank = next[channel];
      if (oldRank !== undefined) {
        next[existingChannel] = oldRank;
      } else {
        delete next[existingChannel];
      }
    }

    next[channel] = rank;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const selectedRank = currentValue[opt.channel];
        return (
          <div
            key={opt.channel}
            className="rounded-xl border border-foreground/10 p-4"
          >
            <p className="mb-3 text-sm font-medium">{opt.text}</p>
            <div className="flex gap-2">
              {scaleOptions.map((scale) => {
                const isSelected = selectedRank === scale.value;
                const isUsedElsewhere =
                  !isSelected && usedRanks.has(scale.value);
                return (
                  <button
                    key={scale.value}
                    onClick={() => handleSelect(opt.channel, scale.value)}
                    disabled={isUsedElsewhere}
                    className={`flex-1 rounded-lg border-2 py-2 text-xs transition-all ${
                      isSelected
                        ? "border-amber-brand bg-amber-brand/10 font-medium text-amber-brand"
                        : isUsedElsewhere
                          ? "border-foreground/5 text-foreground/20 cursor-not-allowed"
                          : "border-foreground/10 text-foreground/50 hover:border-foreground/20"
                    }`}
                  >
                    {scale.emoji && <span className="mr-1">{scale.emoji}</span>}
                    {scale.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
