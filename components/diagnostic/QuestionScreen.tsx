"use client";

import { useState } from "react";
import type { DiagnosticToolConfig } from "@/lib/types/diagnostic";
import { ScaleSelector } from "./ScaleSelector";
import { RankSelector } from "./RankSelector";

const QUESTIONS_PER_PAGE = 5;

interface Props {
  config: DiagnosticToolConfig;
  answers: Record<number, number | Record<string, number>>;
  currentPage: number;
  onAnswer: (questionId: number, value: number | Record<string, number>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export function QuestionScreen({
  config,
  answers,
  currentPage,
  onAnswer,
  onNext,
  onPrev,
  onSubmit,
}: Props) {
  const [fadeIn, setFadeIn] = useState(true);

  const totalPages = Math.ceil(config.questions.length / QUESTIONS_PER_PAGE);
  const startIdx = currentPage * QUESTIONS_PER_PAGE;
  const pageQuestions = config.questions.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);
  const isLastPage = currentPage === totalPages - 1;
  const isRankType = config.scaleType === "rank-4";

  const allAnswered = pageQuestions.every((q) => {
    const ans = answers[q.id];
    if (ans === undefined) return false;
    if (isRankType) {
      const rankAns = ans as Record<string, number>;
      return Object.keys(rankAns).length === config.scaleOptions.length;
    }
    return true;
  });

  const totalAnswered = Object.keys(answers).length;
  const progress = (totalAnswered / config.questions.length) * 100;

  const changePage = (dir: "next" | "prev") => {
    setFadeIn(false);
    setTimeout(() => {
      if (dir === "next") onNext();
      else onPrev();
      setFadeIn(true);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface to-surface-sunken">
      {/* Progress Bar — sticky */}
      <div className="sticky top-0 z-50 bg-surface-raised/95 backdrop-blur-sm border-b border-edge px-6 py-3">
        <div className="max-w-[640px] mx-auto flex items-center gap-4">
          <span className="text-[13px] text-ink-tertiary font-semibold font-display whitespace-nowrap">
            {totalAnswered}/{config.questions.length}
          </span>
          <div className="flex-1 h-1.5 bg-edge-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-brand to-[#E67E22] rounded-full transition-all duration-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[13px] text-ink-tertiary font-semibold font-display whitespace-nowrap">
            {currentPage + 1}/{totalPages}
          </span>
        </div>
      </div>

      {/* Questions */}
      <div
        className="max-w-[640px] mx-auto px-6 pt-8 pb-32 transition-all duration-300"
        style={{
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(12px)",
        }}
      >
        {pageQuestions.map((q, i) => {
          const idx = q.id;
          const isAnswered = answers[idx] !== undefined;

          return (
            <div
              key={idx}
              className={`bg-surface-raised rounded-2xl p-6 mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 ${
                isAnswered
                  ? "border-2 border-amber-brand/25"
                  : "border-2 border-transparent"
              }`}
            >
              <div className="flex gap-3 mb-4 items-start">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-[13px] font-bold font-display shrink-0 transition-all duration-300 ${
                    isAnswered
                      ? "bg-amber-brand text-white"
                      : "bg-edge-subtle text-ink-tertiary"
                  }`}
                >
                  {startIdx + i + 1}
                </span>
                <p className="text-[15px] leading-relaxed text-ink font-medium pt-1">
                  {q.text}
                </p>
              </div>

              {isRankType && q.options ? (
                <RankSelector
                  options={q.options}
                  scaleOptions={config.scaleOptions}
                  value={answers[idx] as Record<string, number> | undefined}
                  onChange={(val) => onAnswer(idx, val)}
                />
              ) : (
                <ScaleSelector
                  options={config.scaleOptions}
                  value={answers[idx] as number | undefined}
                  onChange={(val) => onAnswer(idx, val)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation — fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-raised/95 backdrop-blur-sm border-t border-edge px-6 py-4 z-50">
        <div className="max-w-[640px] mx-auto flex justify-between gap-3">
          <button
            onClick={() => changePage("prev")}
            disabled={currentPage === 0}
            className={`rounded-xl border-[1.5px] border-edge px-6 py-3 text-sm font-semibold transition-colors ${
              currentPage === 0
                ? "text-ink-muted cursor-default"
                : "text-ink-secondary bg-surface hover:bg-surface-sunken"
            }`}
          >
            ← 이전
          </button>

          {isLastPage ? (
            <button
              onClick={onSubmit}
              disabled={totalAnswered < config.questions.length}
              className={`rounded-xl px-8 py-3 text-sm font-bold border-none transition-all duration-300 ${
                totalAnswered >= config.questions.length
                  ? "bg-gradient-to-br from-teal-brand to-[#2ECC71] text-white shadow-lg"
                  : "bg-edge-subtle text-ink-tertiary cursor-default"
              }`}
            >
              결과 보기
            </button>
          ) : (
            <button
              onClick={() => changePage("next")}
              className={`rounded-xl px-8 py-3 text-sm font-bold border-none transition-all duration-300 ${
                allAnswered
                  ? "bg-gradient-to-br from-amber-brand to-[#E67E22] text-white"
                  : "bg-edge-subtle text-ink-tertiary"
              }`}
            >
              다음 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
