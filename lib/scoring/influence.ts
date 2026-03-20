import type { InfluenceProfile } from "@/lib/types/zone";

/**
 * Influence profile: Leadership strength × Followership type
 *
 * Strong Leader + Strong Follower → Partner
 * Weak Leader + Strong Follower → Supporter
 * Strong Leader + Weak Follower → Commander
 * Weak Leader + Weak Follower → Observer
 *
 * "Strong follower" = exemplary or conformist (high active engagement)
 * "Strong leader" = total score ≥ 50% of max possible
 */
export function calculateInfluenceProfile(
  leadershipScores: Record<string, number>,
  followershipType: string
): InfluenceProfile {
  const leadershipTotal = Object.values(leadershipScores).reduce((a, b) => a + b, 0);
  // 4 styles × 5 items × 5 max = 100
  const leadershipMax = Object.keys(leadershipScores).length * 25;
  const isStrongLeader = leadershipTotal / leadershipMax >= 0.5;
  const isStrongFollower = ["exemplary", "conformist"].includes(followershipType);

  if (isStrongLeader && isStrongFollower) return "partner";
  if (!isStrongLeader && isStrongFollower) return "supporter";
  if (isStrongLeader && !isStrongFollower) return "commander";
  return "observer";
}
