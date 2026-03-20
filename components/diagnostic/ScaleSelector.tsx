"use client";

import type { ScaleOption } from "@/lib/types/diagnostic";

interface Props {
  options: ScaleOption[];
  value: number | undefined;
  onChange: (value: number) => void;
}

/**
 * 7점 이상 척도: 숫자 버튼 + 양끝/중간 라벨
 * 0       3       6
 * 아니다  보통    언제나
 * 없다    반반    항상
 */
function NumericScale({ options, value, onChange }: Props) {
  const min = options[0].value;
  const max = options[options.length - 1].value;
  const mid = Math.floor((min + max) / 2);

  return (
    <div>
      {/* 라벨 */}
      <div className="flex justify-between mb-1.5 px-0.5">
        <span className="text-[10px] text-ink-muted text-center leading-tight">
          아니다<br />없다
        </span>
        <span className="text-[10px] text-ink-muted text-center leading-tight">
          보통<br />반반
        </span>
        <span className="text-[10px] text-ink-muted text-center leading-tight">
          언제나<br />항상
        </span>
      </div>
      {/* 숫자 버튼 */}
      <div className="flex gap-1.5">
        {options.map((opt) => {
          const selected = value === opt.value;
          const isAnchor = opt.value === min || opt.value === mid || opt.value === max;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all duration-200 ${
                selected
                  ? "bg-gradient-to-br from-amber-brand to-[#E67E22] text-white shadow-md scale-110"
                  : isAnchor
                    ? "bg-surface border-[1.5px] border-edge text-ink hover:bg-surface-sunken"
                    : "bg-surface border-[1.5px] border-edge-subtle text-ink-tertiary hover:bg-surface-sunken"
              }`}
            >
              {opt.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 기본 척도: 텍스트 라벨 버튼
 */
function DefaultScale({ options, value, onChange }: Props) {
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

export function ScaleSelector({ options, value, onChange }: Props) {
  // 7점 이상 척도는 숫자형 UI
  if (options.length >= 7) {
    return <NumericScale options={options} value={value} onChange={onChange} />;
  }
  return <DefaultScale options={options} value={value} onChange={onChange} />;
}
