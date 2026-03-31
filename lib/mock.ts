import { COMMUNITIES } from "@/lib/data/communities";
import type { AudienceRow, MerchantRow } from "@/lib/types";

const PARENT_MERCHANTS = [
  "Live Nation",
  "Fanatics",
  "Ticketmaster",
  "AEG",
  "Madison Square Garden Sports",
  "Legends",
  "SeatGeek",
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function boundedNumber(seed: number, min: number, max: number, decimals = 1): number {
  const ratio = (seed % 1000) / 1000;
  const value = min + (max - min) * ratio;
  return Number(value.toFixed(decimals));
}

function buildMerchantRows(communityId: string): MerchantRow[] {
  const base = hashString(communityId);

  return Array.from({ length: 8 }).map((_, idx) => {
    const seed = base + idx * 7919;
    return {
      merchantId: `${communityId}_merchant_${idx + 1}`,
      merchantName: `Merchant ${idx + 1} (${communityId.toUpperCase()})`,
      parentMerchant: PARENT_MERCHANTS[(base + idx) % PARENT_MERCHANTS.length],
      percentFans: boundedNumber(seed, 1.2, 16.8, 2),
      purchasesPerFanIndex: boundedNumber(seed + 11, 65, 155, 1),
      compositeIndex: boundedNumber(seed + 29, 55, 170, 1),
    };
  });
}

export const MOCK_AUDIENCE_DATA: AudienceRow[] = COMMUNITIES.map((community) => {
  const seed = hashString(community.id);

  return {
    communityId: community.id,
    communityName: community.name,
    percentFans: boundedNumber(seed, 2, 32, 2),
    purchasesPerFanIndex: boundedNumber(seed + 17, 60, 145, 1),
    compositeIndex: boundedNumber(seed + 31, 50, 165, 1),
  };
});

export const MOCK_MERCHANT_DATA: Record<string, MerchantRow[]> = COMMUNITIES.reduce(
  (acc, community) => {
    acc[community.id] = buildMerchantRows(community.id);
    return acc;
  },
  {} as Record<string, MerchantRow[]>,
);
