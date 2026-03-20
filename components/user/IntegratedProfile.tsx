"use client";

import { AlertTriangle, Check, HelpCircle, Sparkles, Shield, Zap } from "lucide-react";
import type { IntegratedProfileResult } from "@/lib/scoring/integrated";
import { ZONE_CONFIG } from "@/lib/types/zone";

interface Props {
  profile: IntegratedProfileResult;
}

export function IntegratedProfile({ profile }: Props) {
  const {
    predictions, inconsistencies, crossPatterns,
    attitudeWarnings, burnoutAlerts, influenceProfile, completedZones,
  } = profile;

  return (
    <div className="space-y-8">
      {/* ═══ Zone Completion Status ═══ */}
      <section>
        <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-teal-brand" /> 완료된 Zone
        </h3>
        <div className="flex gap-2 flex-wrap">
          {(["A", "B", "C", "M"] as const).map((z) => {
            const info = ZONE_CONFIG[z];
            const done = completedZones.includes(z);
            return (
              <span
                key={z}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: done ? `var(--color-${info.color}-50, #f0fdf4)` : "#f8f9fa",
                  color: done ? `var(--color-${info.color}-700, #15803d)` : "#adb5bd",
                  border: `1px solid ${done ? `var(--color-${info.color}-200, #bbf7d0)` : "#e9ecef"}`,
                }}
              >
                {done ? "✓" : "○"} Zone {z}: {info.labelKo}
              </span>
            );
          })}
        </div>
      </section>

      {/* ═══ Cross-Zone Patterns ═══ */}
      {crossPatterns.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-brand" /> 통합 패턴
          </h3>
          <div className="space-y-3">
            {crossPatterns.map((pat) => (
              <div
                key={pat.name}
                className="bg-surface-raised rounded-2xl p-5 border border-edge-subtle"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{pat.layers.split(" ")[0]}</span>
                  <span className="text-base font-black text-ink">{pat.name}</span>
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed mb-3">
                  {pat.description}
                </p>
                <div className="bg-surface-sunken rounded-lg p-3">
                  <p className="text-xs text-ink-tertiary font-bold mb-1">코칭 포인트</p>
                  <p className="text-xs text-ink-secondary leading-relaxed">{pat.coachingTip}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Influence Profile ═══ */}
      {influenceProfile && (
        <section>
          <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-coral-brand" /> 영향력 프로필
          </h3>
          <div className="bg-surface-raised rounded-2xl p-5 border border-edge-subtle text-center">
            <span className="text-2xl font-black font-display capitalize text-coral-brand">
              {influenceProfile}
            </span>
            <p className="text-xs text-ink-secondary mt-2">
              리더십 × 팔로워십 교차 분석 결과
            </p>
          </div>
        </section>
      )}

      {/* ═══ Predictions ═══ */}
      {predictions.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500" /> Zone 간 예측 검증
          </h3>
          <div className="space-y-2">
            {predictions.map((pred, i) => (
              <div
                key={i}
                className="bg-surface-raised rounded-xl p-4 border border-edge-subtle"
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${pred.matched ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>
                    {pred.matched ? "일치" : "불일치"}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-ink">{pred.rule}</p>
                    <p className="text-xs text-ink-secondary mt-1">{pred.coaching}</p>
                    <span className="text-[10px] text-ink-muted">신뢰도: {pred.confidence}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Inconsistencies ═══ */}
      {inconsistencies.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-500" /> 탐색의 단서
          </h3>
          <div className="space-y-2">
            {inconsistencies.map((inc) => (
              <div
                key={inc.id}
                className="bg-purple-50 rounded-xl p-4 border border-purple-100"
              >
                <p className="text-sm font-bold text-purple-900 mb-1">{inc.interpretation}</p>
                <p className="text-xs text-purple-700 italic">&quot;{inc.coachingQuestion}&quot;</p>
                <span className="text-[10px] text-purple-500 mt-1 inline-block">{inc.zones}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Attitude Warnings ═══ */}
      {attitudeWarnings.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600" /> 태도 경고
          </h3>
          <div className="space-y-2">
            {attitudeWarnings.map((warn, i) => (
              <div
                key={i}
                className="bg-amber-50 rounded-xl p-4 border border-amber-100"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-amber-900">
                    {warn.attitude} ({warn.type === "facilitating" ? "촉진" : "보호"}) — {warn.score}점
                  </span>
                </div>
                <p className="text-xs text-amber-800">
                  영향받는 강점: {warn.affectedStrengths.join(", ")} → {warn.impact}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Burnout Alerts ═══ */}
      {burnoutAlerts.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" /> 번아웃 경고
          </h3>
          <div className="space-y-2">
            {burnoutAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl p-4 border ${alert.severity === "high" ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}
              >
                <p className={`text-sm font-bold mb-1 ${alert.severity === "high" ? "text-red-900" : "text-orange-900"}`}>
                  {alert.message}
                </p>
                <p className={`text-xs ${alert.severity === "high" ? "text-red-700" : "text-orange-700"}`}>
                  {alert.action}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
