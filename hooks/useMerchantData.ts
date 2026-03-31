"use client";

import { useEffect, useState } from "react";

import type { MerchantQueryParams, MerchantRow } from "@/lib/types";

type MerchantHookParams = Omit<MerchantQueryParams, "communityId"> & {
  communityId?: string;
};

export function useMerchantData(params: MerchantHookParams) {
  const communityId = params.communityId;
  const merchantKey = params.merchantKey;
  const categoryName = params.categoryName;
  const states = params.states ?? [];
  const statesKey = (params.states ?? []).join("|");
  const requestBody = JSON.stringify({
    communityId,
    merchantKey,
    categoryName,
    states,
  });

  const [data, setData] = useState<MerchantRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!communityId) {
      setData([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchMerchantData() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/merchants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch merchant data");
        }

        const json = (await response.json()) as MerchantRow[];
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) {
          setError("Unable to load merchant data.");
          setData([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchMerchantData();

    return () => {
      cancelled = true;
    };
  }, [
    communityId,
    merchantKey,
    categoryName,
    statesKey,
    requestBody,
  ]);

  return { data, isLoading, error };
}
