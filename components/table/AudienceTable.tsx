"use client";

import { ColumnHeader } from "@/components/table/ColumnHeader";
import { RelativeHeatBar } from "@/components/table/RelativeHeatBar";
import type { SortConfig, SortKey } from "@/hooks/useAudienceData";
import { getRobustMetricScale } from "@/lib/metrics";
import type { AudienceRow } from "@/lib/types";

type AudienceTableProps = {
  rows: AudienceRow[];
  selectedCommunityId?: string;
  isLoading: boolean;
  canRenderTable: boolean;
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
  onRowClick: (row: AudienceRow) => void;
};

export function AudienceTable({
  rows,
  selectedCommunityId,
  isLoading,
  canRenderTable,
  sortConfig,
  onSort,
  onRowClick,
}: AudienceTableProps) {
  const metricToneClass = (value: number, baseline: number) => {
    if (value > baseline) return "font-semibold text-red-700";
    if (value < baseline) return "font-semibold text-blue-700";
    return "font-semibold text-slate-700";
  };

  if (!canRenderTable) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-black/60">
        Select a brand or category to get started.
      </div>
    );
  }

  const percentFansScale = getRobustMetricScale(rows.map((row) => row.percentFans));
  const purchasesPerFanScale = getRobustMetricScale(rows.map((row) => row.purchasesPerFanIndex));
  const compositeScale = getRobustMetricScale(rows.map((row) => row.compositeIndex));

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full border-collapse">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <ColumnHeader
              label="Community Name"
              sortKey="communityName"
              tooltip="Placeholder helper text for this metric."
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <ColumnHeader
              label="Percent of Fans"
              sortKey="percentFans"
              tooltip="Placeholder helper text for this metric."
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <ColumnHeader
              label="Fan Index"
              sortKey="purchasesPerFanIndex"
              tooltip="Placeholder helper text for this metric."
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <ColumnHeader
              label="Purchases Per Fan Index"
              sortKey="compositeIndex"
              tooltip="Placeholder helper text for this metric."
              sortConfig={sortConfig}
              onSort={onSort}
            />
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} className="border-b border-slate-200/60">
                <td className="px-4 py-3">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                </td>
              </tr>
            ))}

          {!isLoading &&
            rows.map((row) => {
              const isActive = row.communityId === selectedCommunityId;
              return (
                <tr
                  key={row.communityId}
                  onClick={() => onRowClick(row)}
                  className={`cursor-pointer border-b border-slate-200/60 transition ${
                    isActive ? "bg-accent/10" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3 text-sm">{row.communityName}</td>
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
                        {row.purchasesPerFanIndex.toFixed(1)}
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
                        {row.compositeIndex.toFixed(1)}
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
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
