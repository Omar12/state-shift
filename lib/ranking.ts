// lib/ranking.ts
import type { Feeling, Intervention, PersonalizationState, InterventionStats } from "@/types/app";
import { getInterventionsForFeeling } from "@/content/interventions";

function getStats(
  feeling: Feeling,
  interventionId: string,
  personalization: PersonalizationState
): InterventionStats | undefined {
  return personalization.byFeeling[feeling]?.interventionStats[interventionId];
}

export function rankInterventions(
  feeling: Feeling,
  interventions: Intervention[],
  personalization: PersonalizationState
): Intervention[] {
  return [...interventions].sort((a, b) => {
    const sa = getStats(feeling, a.id, personalization);
    const sb = getStats(feeling, b.id, personalization);

    // 1. manualRank — lower number = higher priority
    const ma = sa?.manualRank ?? Infinity;
    const mb = sb?.manualRank ?? Infinity;
    if (ma !== mb) return ma - mb;

    // 2. highest totalScore
    const scoreA = sa?.totalScore ?? 0;
    const scoreB = sb?.totalScore ?? 0;
    if (scoreB !== scoreA) return scoreB - scoreA;

    // 3. lowest shownCount
    const shownA = sa?.shownCount ?? 0;
    const shownB = sb?.shownCount ?? 0;
    if (shownA !== shownB) return shownA - shownB;

    // 4. least recently shown
    const lastA = sa?.lastShownAt ? new Date(sa.lastShownAt).getTime() : 0;
    const lastB = sb?.lastShownAt ? new Date(sb.lastShownAt).getTime() : 0;
    if (lastA !== lastB) return lastA - lastB;

    // 5. default curated sortOrder
    return a.sortOrder - b.sortOrder;
  });
}

export function getNextIntervention(
  feeling: Feeling,
  shownIds: string[],
  personalization: PersonalizationState
): Intervention | null {
  const all = getInterventionsForFeeling(feeling);
  const ranked = rankInterventions(feeling, all, personalization);
  return ranked.find((i) => !shownIds.includes(i.id)) ?? null;
}
