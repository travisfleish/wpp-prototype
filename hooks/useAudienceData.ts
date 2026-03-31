"use client";

import { useEffect, useMemo, useState } from "react";

import type { AudienceQueryParams, AudienceRow } from "@/lib/types";

export type SortKey = keyof Pick<
  AudienceRow,
  "communityName" | "percentFans" | "purchasesPerFanIndex" | "compositeIndex"
>;

export type SortConfig = {
  key: SortKey;
  direction: "asc" | "desc";
} | null;

export function useAudienceData(params: AudienceQueryParams) {
  const merchantKey = params.merchantKey;
  const categoryName = params.categoryName;
  const states = params.states ?? [];
  const statesKey = (params.states ?? []).join("|");
  const requestBody = JSON.stringify({
    merchantKey,
    categoryName,
    states,
  });

  const [data, setData] = useState<AudienceRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if (!merchantKey && !categoryName) {
      setData([]);
      return;
    }

    let cancelled = false;

    async function fetchAudienceData() {
      setIsLoading(true);
      setError(null);
      setCurrentPage(1);

      try {
        const response = await fetch("/api/audience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch audience data");
        }

        const json = (await response.json()) as AudienceRow[];
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) {
          setError("Unable to load audience data.");
          setData([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAudienceData();

    return () => {
      cancelled = true;
    };
  }, [merchantKey, categoryName, statesKey, requestBody]);

  const processedData = useMemo(() => {
    let rows = [...data];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      rows = rows.filter((row) => row.communityName.toLowerCase().includes(query));
    }

    if (sortConfig) {
      rows.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        const comparison =
          typeof aValue === "string" && typeof bValue === "string"
            ? aValue.localeCompare(bValue)
            : Number(aValue) - Number(bValue);
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return rows;
  }, [data, searchQuery, sortConfig]);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [processedData, currentPage, rowsPerPage]);

  return {
    data,
    isLoading,
    error,
    sortConfig,
    setSortConfig,
    searchQuery,
    setSearchQuery,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    processedData,
    pagedData,
  };
}
