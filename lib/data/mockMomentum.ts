export type MomentumPoint = {
  communityId: string;
  communityName: string;
  growth: number;
  retention: number;
  momentumScore: number;
  audiencePercent: number;
};

type CommunitySeed = {
  communityId: string;
  communityName: string;
  growth: number;
  retention: number;
  momentumScore: number;
  audiencePercent: number;
};

const MOMENTUM_COMMUNITIES: CommunitySeed[] = [
  {
    communityId: "nba",
    communityName: "NBA",
    growth: 7.2,
    retention: 8.5,
    momentumScore: 74,
    audiencePercent: 14.6,
  },
  {
    communityId: "nfl",
    communityName: "NFL",
    growth: 9.1,
    retention: 7.1,
    momentumScore: 81,
    audiencePercent: 18.4,
  },
  {
    communityId: "wnba",
    communityName: "WNBA",
    growth: 11.4,
    retention: 6.2,
    momentumScore: 77,
    audiencePercent: 9.2,
  },
  {
    communityId: "mlb",
    communityName: "MLB",
    growth: 4.6,
    retention: 5.9,
    momentumScore: 63,
    audiencePercent: 12.1,
  },
  {
    communityId: "nhl",
    communityName: "NHL",
    growth: 2.4,
    retention: 6.7,
    momentumScore: 59,
    audiencePercent: 8.8,
  },
  {
    communityId: "mls",
    communityName: "MLS",
    growth: 8.7,
    retention: 4.3,
    momentumScore: 66,
    audiencePercent: 7.6,
  },
  {
    communityId: "nwsl",
    communityName: "NWSL",
    growth: 5.4,
    retention: 7.9,
    momentumScore: 71,
    audiencePercent: 13.8,
  },
];

function getBrandOffset(brandId: string): number {
  return Array.from(brandId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getMockMomentumData(brandId: string): MomentumPoint[] {
  const offset = getBrandOffset(brandId);

  return MOMENTUM_COMMUNITIES.map((point, index) => {
    const growthDelta = ((offset + index * 17) % 9) - 4;
    const retentionDelta = ((offset + index * 13) % 7) - 3;
    const audienceDelta = ((offset + index * 5) % 9) - 4;
    const momentumNoise = ((offset + index * 11) % 25) - 12;

    const growth = clamp(point.growth + growthDelta * 0.55, -2, 15);
    const retention = clamp(point.retention + retentionDelta * 0.45, -1, 12);
    const audiencePercent = clamp(point.audiencePercent + audienceDelta * 0.7, 3, 24);

    // Momentum is broadly positively correlated with growth, with deterministic noise.
    const momentumScore = clamp(48 + growth * 2.9 + momentumNoise, 24, 98);

    return {
      communityId: point.communityId,
      communityName: point.communityName,
      growth,
      retention,
      momentumScore,
      audiencePercent,
    };
  });
}
