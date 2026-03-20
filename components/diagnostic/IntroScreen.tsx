"use client";

import { useState, useEffect } from "react";
import type { DiagnosticToolConfig } from "@/lib/types/diagnostic";

interface Props {
  config: DiagnosticToolConfig;
  onStart: () => void;
}

export function IntroScreen({ config, onStart }: Props) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const categories = Object.entries(config.interpretations).filter(([key]) => !key.startsWith("_"));
  const estimatedMinutes = Math.ceil(config.questions.length * 0.3);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dark grain p-6">
      <div
        className="max-w-[560px] w-full text-center transition-all duration-700 ease-out"
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(30px)",
        }}
      >
        {/* 카테고리 아이콘 */}
        <div className="flex justify-center gap-3 mb-8 text-4xl">
          {categories.map(([key, interp], i) => (
            <span
              key={key}
              className="transition-all duration-500"
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "scale(1)" : "scale(0)",
                transitionDelay: `${300 + i * 100}ms`,
                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {interp.icon}
            </span>
          ))}
        </div>

        {/* 제목 */}
        <h1 className="text-[42px] font-black text-ink-inverse tracking-tight leading-tight">
          {config.name}
        </h1>
        {config.nameEn && (
          <p className="mt-2 text-[15px] text-ink-muted tracking-[4px] uppercase font-display">
            {config.nameEn}
          </p>
        )}

        {/* 설명 카드 */}
        <div className="mt-9 bg-ink-inverse/[0.06] backdrop-blur-xl rounded-2xl p-7 border border-ink-inverse/[0.08] text-left">
          <p className="text-[14.5px] leading-[1.8] text-ink-inverse/75">
            {config.description}
          </p>
        </div>

        {/* 카테고리 그리드 */}
        {(() => {
          const count = categories.length;
          // 6개: 3+3, 4개: 4열 가운데, 2개: 2열 가운데, 그 외: min(count,5)열
          const cols = count === 6 ? 3 : count <= 4 ? count : Math.min(count, 5);
          return (
            <div
              className="mt-8 grid gap-2 justify-center"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, ${count <= 4 ? "120px" : "1fr"}))`,
              }}
            >
              {categories.map(([key, interp], i) => (
                <div
                  key={key}
                  className="rounded-[10px] py-3 px-1 text-center transition-all duration-500 overflow-hidden"
                  style={{
                    background: `${interp.color}15`,
                    border: `1px solid ${interp.color}30`,
                    opacity: animate ? 1 : 0,
                    transform: animate ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${500 + i * 80}ms`,
                  }}
                >
                  <div className="text-xl mb-1">{interp.icon}</div>
                  <div className="text-[11px] sm:text-[13px] font-bold truncate px-0.5" style={{ color: interp.color }}>
                    {interp.name}
                  </div>
                  <div className="text-[9px] sm:text-[10.5px] text-ink-inverse/40 mt-0.5 truncate px-0.5">
                    {interp.nameEn}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* 정보 */}
        <div className="flex justify-center gap-6 mt-7 text-[13px] text-ink-muted font-display">
          <span>{config.questions.length}문항</span>
          <span className="text-ink-muted/40">·</span>
          <span>약 {estimatedMinutes}분</span>
          <span className="text-ink-muted/40">·</span>
          <span>즉시 결과</span>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="mt-7 text-base font-bold text-surface-dark bg-gradient-to-br from-amber-brand to-[#E67E22] rounded-xl px-14 py-4 shadow-[0_4px_24px_rgba(243,156,18,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(243,156,18,0.4)]"
        >
          진단 시작하기
        </button>
      </div>
    </div>
  );
}
