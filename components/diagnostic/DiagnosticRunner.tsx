"use client";

import { useState, useEffect, useCallback } from "react";
import type { DiagnosticToolConfig, DiagnosticResult } from "@/lib/types/diagnostic";
import { calculateScores } from "@/lib/scoring/engine";
import { detectPattern } from "@/lib/utils/pattern-detect";
import { IntroScreen } from "./IntroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { ResultScreen } from "./ResultScreen";

type Phase = "intro" | "questions" | "result";

const STORAGE_PREFIX = "diag_answers_";

interface Props {
  config: DiagnosticToolConfig;
  userId?: string;
  workshopId?: string;
  onComplete?: (result: Omit<DiagnosticResult, "id">) => void;
}

export function DiagnosticRunner({ config, userId, workshopId, onComplete }: Props) {
  const storageKey = `${STORAGE_PREFIX}${config.slug}`;

  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<number, number | Record<string, number>>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [patternType, setPatternType] = useState<string | undefined>();

  // localStorage에서 이전 답변 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
    } catch {
      // 무시
    }
  }, [storageKey]);

  // 답변 변경 시 localStorage에 백업
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(answers));
      } catch {
        // 무시
      }
    }
  }, [answers, storageKey]);

  const handleAnswer = useCallback(
    (questionId: number, value: number | Record<string, number>) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const handleStart = () => {
    setPhase("questions");
    setCurrentPage(0);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    const calculatedScores = calculateScores(config, answers);
    setScores(calculatedScores);

    let detected: string | undefined;
    if (config.patternConfig) {
      detected = detectPattern(config.patternConfig.type, calculatedScores);
      setPatternType(detected);
    }

    try { localStorage.removeItem(storageKey); } catch { /* 무시 */ }

    onComplete?.({
      userId: userId ?? "guest",
      toolId: config.id,
      workshopId,
      answers,
      scores: calculatedScores,
      patternType: detected,
      completedAt: new Date().toISOString(),
    });

    setPhase("result");
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setAnswers({});
    setScores({});
    setPatternType(undefined);
    setCurrentPage(0);
    setPhase("intro");
    window.scrollTo(0, 0);
  };

  switch (phase) {
    case "intro":
      return <IntroScreen config={config} onStart={handleStart} />;

    case "questions":
      return (
        <QuestionScreen
          config={config}
          answers={answers}
          currentPage={currentPage}
          onAnswer={handleAnswer}
          onNext={() => setCurrentPage((p) => p + 1)}
          onPrev={() => setCurrentPage((p) => Math.max(0, p - 1))}
          onSubmit={handleSubmit}
        />
      );

    case "result":
      return (
        <div>
          <ResultScreen
            config={config}
            scores={scores}
            patternType={patternType}
          />
          <div className="max-w-[700px] mx-auto px-5 pb-12 text-center print:hidden">
            <button
              onClick={handleRestart}
              className="text-sm font-bold text-[#495057] bg-white border-[1.5px] border-[#dee2e6] rounded-[14px] px-8 py-3.5 hover:bg-[#f8f9fa] transition-colors"
            >
              🔄 다시 진단하기
            </button>
          </div>
        </div>
      );
  }
}
