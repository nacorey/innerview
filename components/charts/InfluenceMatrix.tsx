"use client";

import type { InfluenceProfile } from "@/lib/types/zone";

interface Props {
  profile: InfluenceProfile;
  leadershipTotal: number;
  leadershipMax: number;
  followershipType: string;
}

const PROFILE_CONFIG: Record<InfluenceProfile, {
  label: string; labelEn: string; emoji: string; color: string;
  description: string; position: { x: string; y: string };
}> = {
  partner: {
    label: "파트너", labelEn: "Partner", emoji: "🤝", color: "#1D9E75",
    description: "조직에 적극 참여하면서도 독자적 판단으로 리더와 대등하게 영향력을 행사합니다.",
    position: { x: "75%", y: "25%" },
  },
  supporter: {
    label: "서포터", labelEn: "Supporter", emoji: "🛡️", color: "#2E75B6",
    description: "팀의 안정적 기반이 되며, 리더의 방향을 충실히 지원하면서 조직을 뒷받침합니다.",
    position: { x: "25%", y: "25%" },
  },
  commander: {
    label: "커맨더", labelEn: "Commander", emoji: "⚔️", color: "#D85A30",
    description: "강한 리더십으로 방향을 제시하지만, 팔로워로서의 유연성 개발이 필요합니다.",
    position: { x: "75%", y: "75%" },
  },
  observer: {
    label: "옵저버", labelEn: "Observer", emoji: "🔭", color: "#868e96",
    description: "현재는 관망 모드입니다. 리더십과 팔로워십 모두 개발 여지가 큽니다.",
    position: { x: "25%", y: "75%" },
  },
};

export function InfluenceMatrix({ profile, leadershipTotal, leadershipMax, followershipType }: Props) {
  const config = PROFILE_CONFIG[profile];

  return (
    <div>
      {/* Current profile badge */}
      <div className="text-center mb-5">
        <span className="text-3xl">{config.emoji}</span>
        <div className="mt-1">
          <span className="text-xl font-black font-display" style={{ color: config.color }}>
            {config.label}
          </span>
          <span className="text-sm text-ink-muted ml-1.5">({config.labelEn})</span>
        </div>
        <p className="text-xs text-ink-secondary mt-2 max-w-xs mx-auto">{config.description}</p>
      </div>

      {/* 2x2 Matrix */}
      <div className="relative mx-auto aspect-square w-full max-w-[280px]">
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-ink-muted">
          리더십 강도 →
        </div>
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-ink-muted">
          팔로워십 강도 →
        </div>

        <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-1">
          {(["supporter", "partner", "observer", "commander"] as InfluenceProfile[]).map((p) => {
            const c = PROFILE_CONFIG[p];
            const isActive = p === profile;
            return (
              <div
                key={p}
                className="rounded-lg flex flex-col items-center justify-center text-center transition-all"
                style={{
                  backgroundColor: isActive ? `${c.color}18` : "#f8f9fa",
                  border: isActive ? `2px solid ${c.color}` : "1px solid #e9ecef",
                  opacity: isActive ? 1 : 0.5,
                }}
              >
                <span className="text-lg">{c.emoji}</span>
                <span
                  className="text-xs font-bold mt-0.5"
                  style={{ color: isActive ? c.color : "#868e96" }}
                >
                  {c.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score breakdown */}
      <div className="flex justify-center gap-6 mt-6 text-sm">
        <div className="text-center">
          <div className="text-ink-muted text-xs">리더십 합계</div>
          <div className="font-bold">{leadershipTotal}/{leadershipMax}</div>
        </div>
        <div className="text-center">
          <div className="text-ink-muted text-xs">팔로워십 유형</div>
          <div className="font-bold capitalize">{followershipType}</div>
        </div>
      </div>
    </div>
  );
}
