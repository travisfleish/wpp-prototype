"use client";

import { useMemo, useState } from "react";

import { Button } from "@genius-sports/gs-marketing-ui";

import { RelativeHeatBar } from "@/components/table/RelativeHeatBar";
import { getRobustMetricScale } from "@/lib/metrics";
import type { MerchantRow } from "@/lib/types";

type MerchantDrawerProps = {
  communityName: string;
  merchantCount: number;
  rows: MerchantRow[];
  isLoading: boolean;
  onClose: () => void;
};

type MerchantMetricSortKey = keyof Pick<
  MerchantRow,
  "percentFans" | "purchasesPerFanIndex" | "compositeIndex"
>;

type MerchantSortConfig = {
  key: MerchantMetricSortKey;
  direction: "asc" | "desc";
} | null;

export function MerchantDrawer({
  communityName,
  merchantCount,
  rows,
  isLoading,
  onClose,
}: MerchantDrawerProps) {
  const [sortConfig, setSortConfig] = useState<MerchantSortConfig>(null);

  const metricToneClass = (value: number, baseline: number) => {
    if (value > baseline) return "font-semibold text-red-700";
    if (value < baseline) return "font-semibold text-blue-700";
    return "font-semibold text-slate-700";
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;

    return [...rows].sort((a, b) => {
      const comparison = Number(a[sortConfig.key]) - Number(b[sortConfig.key]);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [rows, sortConfig]);

  function handleSort(key: MerchantMetricSortKey) {
    if (!sortConfig || sortConfig.key !== key) {
      setSortConfig({ key, direction: "asc" });
      return;
    }

    if (sortConfig.direction === "asc") {
      setSortConfig({ key, direction: "desc" });
      return;
    }

    setSortConfig(null);
  }

  function sortIndicatorFor(key: MerchantMetricSortKey) {
    if (!sortConfig || sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  }

  const percentFansScale = getRobustMetricScale(rows.map((row) => row.percentFans));
  const purchasesPerFanScale = getRobustMetricScale(rows.map((row) => row.purchasesPerFanIndex));
  const compositeScale = getRobustMetricScale(rows.map((row) => row.compositeIndex));

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="font-heading text-xl text-black">{communityName} Merchants</h2>
          <p className="text-sm text-black/65">{merchantCount} merchants in this community</p>
        </div>
        <Button variant="outlineOnDark" onClick={onClose} type="button">
          Collapse
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black/85">
                Merchant
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black/85">
                <button
                  type="button"
                  onClick={() => handleSort("percentFans")}
                  className="inline-flex items-center gap-2 hover:text-black"
                >
                  <span>Percent of Fans</span>
                  <span
                    className={`text-[10px] ${
                      sortConfig?.key === "percentFans" ? "text-accent" : "text-black/35"
                    }`}
                  >
                    {sortIndicatorFor("percentFans")}
                  </span>
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black/85">
                <button
                  type="button"
                  onClick={() => handleSort("purchasesPerFanIndex")}
                  className="inline-flex items-center gap-2 hover:text-black"
                >
                  <span>Fan Index</span>
                  <span
                    className={`text-[10px] ${
                      sortConfig?.key === "purchasesPerFanIndex"
                        ? "text-accent"
                        : "text-black/35"
                    }`}
                  >
                    {sortIndicatorFor("purchasesPerFanIndex")}
                  </span>
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black/85">
                <button
                  type="button"
                  onClick={() => handleSort("compositeIndex")}
                  className="inline-flex items-center gap-2 hover:text-black"
                >
                  <span>Purchases Per Fan Index</span>
                  <span
                    className={`text-[10px] ${
                      sortConfig?.key === "compositeIndex" ? "text-accent" : "text-black/35"
                    }`}
                  >
                    {sortIndicatorFor("compositeIndex")}
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`merchant-loading-${idx}`} className="border-b border-slate-200/60">
                  <td className="px-4 py-3">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                  </td>
                </tr>
              ))}

            {!isLoading &&
              sortedRows.map((row) => (
                <tr key={row.merchantId} className="border-b border-slate-200/60">
                  <td className="px-4 py-3 text-sm">{row.merchantName}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`tabular-nums ${metricToneClass(row.percentFans, percentFansScale.baseline)}`}
                      >
                        {row.percentFans.toFixed(2)}%
                      </span>
                      <RelativeHeatBar
                        value={row.percentFans}
                        baseline={percentFansScale.baseline}
                        min={percentFansScale.min}
                        max={percentFansScale.max}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`tabular-nums ${metricToneClass(row.purchasesPerFanIndex, purchasesPerFanScale.baseline)}`}
                      >
                        {row.purchasesPerFanIndex.toFixed(0)}
                      </span>
                      <RelativeHeatBar
                        value={row.purchasesPerFanIndex}
                        baseline={purchasesPerFanScale.baseline}
                        min={purchasesPerFanScale.min}
                        max={purchasesPerFanScale.max}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`tabular-nums ${metricToneClass(row.compositeIndex, compositeScale.baseline)}`}
                      >
                        {row.compositeIndex.toFixed(0)}
                      </span>
                      <RelativeHeatBar
                        value={row.compositeIndex}
                        baseline={compositeScale.baseline}
                        min={compositeScale.min}
                        max={compositeScale.max}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
