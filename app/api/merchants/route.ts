import { NextRequest, NextResponse } from "next/server";

import { COMMUNITIES } from "@/lib/data/communities";
import { runQuery } from "@/lib/snowflake";
import type { MerchantQueryParams } from "@/lib/types";

type MerchantQueryRow = {
  MERCHANT?: string;
  merchant?: string;
  PARENT_MERCHANT?: string;
  parent_merchant?: string;
  PERC_AUDIENCE?: number | string;
  perc_audience?: number | string;
  PERC_INDEX?: number | string;
  perc_index?: number | string;
  PPC_INDEX?: number | string;
  ppc_index?: number | string;
};

const COMMUNITY_KEY_BY_ID = new Map(
  COMMUNITIES.map((community) => [community.id, community.communityKey]),
);

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toMerchantId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function POST(req: NextRequest) {
  const params = (await req.json()) as MerchantQueryParams;

  if (!params.communityId) {
    return NextResponse.json({ message: "communityId is required" }, { status: 400 });
  }

  if (params.merchantKey && params.categoryName) {
    return NextResponse.json(
      { message: "merchantKey and categoryName are mutually exclusive" },
      { status: 400 },
    );
  }

  const communityKey = COMMUNITY_KEY_BY_ID.get(params.communityId);
  if (!communityKey) {
    return NextResponse.json({ message: "Invalid communityId" }, { status: 400 });
  }

  const selectedAudience = params.categoryName || params.merchantKey;
  if (!selectedAudience) {
    return NextResponse.json([]);
  }

  try {
    const binds: Array<string> = [selectedAudience, communityKey];

    const sqlText = `
      SELECT
        MERCHANT,
        PARENT_MERCHANT,
        PERC_AUDIENCE,
        PERC_INDEX,
        PPC_INDEX
      FROM SILAB.TEST_LAB_INTERNS.WPP_COMMUNITY_MERCHANT_INDEXING_ALL_TIME
      WHERE LOWER(AUDIENCE) = LOWER(?)
        AND COMMUNITY = ?
      ORDER BY PERC_AUDIENCE DESC
    `;

    const rows = await runQuery<MerchantQueryRow>(sqlText, binds);
    const response = rows.map((row) => {
      const merchantName = row.MERCHANT ?? row.merchant ?? "";
      return {
        merchantId: toMerchantId(merchantName),
        merchantName,
        parentMerchant: row.PARENT_MERCHANT ?? row.parent_merchant ?? "",
        percentFans: toNumber(row.PERC_AUDIENCE ?? row.perc_audience) * 100,
        purchasesPerFanIndex: toNumber(row.PERC_INDEX ?? row.perc_index),
        compositeIndex: toNumber(row.PPC_INDEX ?? row.ppc_index),
      };
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Merchant query failed", error);
    return NextResponse.json({ message: "Failed to fetch merchant data" }, { status: 500 });
  }
}
