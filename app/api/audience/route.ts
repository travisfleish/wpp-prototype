import { NextRequest, NextResponse } from "next/server";

import { COMMUNITIES } from "@/lib/data/communities";
import { runQuery } from "@/lib/snowflake";
import type { AudienceQueryParams } from "@/lib/types";

type AudienceQueryRow = {
  COMMUNITY?: string;
  community?: string;
  PERC_AUDIENCE?: number | string;
  perc_audience?: number | string;
  PERC_INDEX?: number | string;
  perc_index?: number | string;
  PPC_INDEX?: number | string;
  ppc_index?: number | string;
};

const COMMUNITY_BY_KEY = new Map(
  COMMUNITIES.map((community) => [community.communityKey, community]),
);

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function POST(req: NextRequest) {
  const params = (await req.json()) as AudienceQueryParams;

  if (params.merchantKey && params.categoryName) {
    return NextResponse.json(
      { message: "merchantKey and categoryName are mutually exclusive" },
      { status: 400 },
    );
  }

  const selectedAudience = params.categoryName || params.merchantKey;
  if (!selectedAudience) {
    return NextResponse.json([]);
  }

  try {
    const sqlText = `
      SELECT
        COMMUNITY,
        PERC_AUDIENCE,
        PERC_INDEX,
        PPC_INDEX
      FROM SILAB.TEST_LAB_INTERNS.WPP_COMMUNITY_INDEXING_ALL_TIME
      WHERE LOWER(AUDIENCE) = LOWER(?)
      ORDER BY PERC_AUDIENCE DESC
    `;

    const rows = await runQuery<AudienceQueryRow>(sqlText, [selectedAudience]);
    const response = rows.map((row) => {
      const communityKey = row.COMMUNITY ?? row.community ?? "";
      const community = COMMUNITY_BY_KEY.get(communityKey);
      return {
        communityId: community?.id ?? communityKey.toLowerCase(),
        communityName: community?.name ?? communityKey,
        percentFans: toNumber(row.PERC_AUDIENCE ?? row.perc_audience) * 100,
        purchasesPerFanIndex: toNumber(row.PERC_INDEX ?? row.perc_index),
        compositeIndex: toNumber(row.PPC_INDEX ?? row.ppc_index),
      };
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Audience query failed", error);
    return NextResponse.json({ message: "Failed to fetch audience data" }, { status: 500 });
  }
}
