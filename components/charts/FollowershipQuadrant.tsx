"use client";

interface QuadrantDef {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  shortDesc: string;
  xRange: [number, number];
  yRange: [number, number];
  gridArea: string;
}

interface Props {
  activeEngagement: number;   // X: 0-60
  independentThinking: number; // Y: 0-60
  typeId: string;              // "exemplary" etc.
  quadrants: QuadrantDef[];
}

const GRID_ORDER = ["top-left", "top-right", "bottom-left", "bottom-right"];

export function FollowershipQuadrant({ activeEngagement, independentThinking, typeId, quadrants }: Props) {
  const currentType = quadrants.find((q) => q.id === typeId) ?? quadrants[0];

  // Convert scores to percentages (0-60 → 0-100%)
  const xPct = (activeEngagement / 60) * 100;
  const yPct = 100 - (independentThinking / 60) * 100;

  // Arrange quadrants in grid order
  const gridQuadrants = GRID_ORDER.map((area) =>
    quadrants.find((q) => q.gridArea === area)
  ).filter(Boolean) as QuadrantDef[];

  const pragmatic = quadrants.find((q) => q.gridArea === "center");

  return (
    <div>
      {/* Type badge */}
      <div className="text-center mb-5">
        <span className="text-3xl">{currentType.emoji}</span>
        <div className="mt-1">
          <span
            className="text-xl font-black font-display"
            style={{ color: currentType.color }}
          >
            {currentType.label}
          </span>
        </div>
        <p className="text-xs text-ink-secondary mt-1">{currentType.shortDesc}</p>
      </div>

      {/* Quadrant chart */}
      <div className="relative mx-auto aspect-square w-full max-w-[340px]">
        {/* Axis labels */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-ink-muted whitespace-nowrap">
          적극적·능동적 참여 →
        </div>
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-ink-muted whitespace-nowrap">
          독립적·비판적 사고 →
        </div>

        {/* Grid */}
        <div className="absolute inset-6 rounded-lg overflow-hidden">
          {/* 4 quadrant backgrounds */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {gridQuadrants.map((q) => {
              const isActive = q.id === typeId;
              return (
                <div
                  key={q.id}
                  className="flex flex-col items-center justify-center text-center p-1 transition-all"
                  style={{
                    backgroundColor: isActive ? q.bgColor : "#f8f9fa",
                    border: `1px solid ${isActive ? q.color + "40" : "#e9ecef"}`,
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  <span className="text-lg">{q.emoji}</span>
                  <span
                    className="text-[11px] font-bold mt-0.5"
                    style={{ color: isActive ? q.color : "#adb5bd" }}
                  >
                    {q.label}
                  </span>
                  <span className="text-[9px] text-ink-muted mt-0.5 hidden sm:block">
                    {q.shortDesc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Cross lines */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-ink/10" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-ink/10" />

          {/* Pragmatic center zone */}
          {pragmatic && (
            <div
              className="absolute border border-dashed rounded"
              style={{
                left: `${(20 / 60) * 100}%`,
                top: `${(1 - 40 / 60) * 100}%`,
                width: `${(20 / 60) * 100}%`,
                height: `${(20 / 60) * 100}%`,
                borderColor: pragmatic.color + "50",
                backgroundColor: typeId === "pragmatic" ? pragmatic.bgColor + "60" : "transparent",
              }}
            />
          )}

          {/* User position dot */}
          <div
            className="absolute w-5 h-5 rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{
              left: `${xPct}%`,
              top: `${yPct}%`,
              backgroundColor: "white",
              border: `3px solid ${currentType.color}`,
              boxShadow: `0 0 12px ${currentType.color}40`,
            }}
          />
        </div>
      </div>

      {/* Score readout */}
      <div className="flex justify-center gap-6 mt-8 text-sm">
        <div className="text-center">
          <div className="text-ink-muted text-xs">적극적 참여</div>
          <div className="font-black font-display text-lg" style={{ color: "#C55A11" }}>
            {activeEngagement}<span className="text-xs text-ink-muted">/60</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-ink-muted text-xs">독립적 사고</div>
          <div className="font-black font-display text-lg" style={{ color: "#2E75B6" }}>
            {independentThinking}<span className="text-xs text-ink-muted">/60</span>
          </div>
        </div>
      </div>
    </div>
  );
}
