"use client";

import type { SortConfig, SortKey } from "@/hooks/useAudienceData";

type ColumnHeaderProps = {
  label: string;
  sortKey: SortKey;
  tooltip: string;
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
};

export function ColumnHeader({ label, sortKey, tooltip, sortConfig, onSort }: ColumnHeaderProps) {
  const isActive = sortConfig?.key === sortKey;
  const direction = isActive ? sortConfig?.direction : undefined;

  return (
    <th
      scope="col"
      className="px-4 py-3 text-left text-xs font-heading uppercase tracking-wide text-black/80"
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="group inline-flex items-center gap-2 hover:text-black"
      >
        <span>{label}</span>
        <span className={`text-[10px] ${isActive ? "text-accent" : "text-black/35"}`}>
          {direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕"}
        </span>
        <span className="relative inline-flex items-center">
          <span className="h-4 w-4 rounded-full border border-slate-300 text-center text-[10px] leading-[14px] text-black/60">
            i
          </span>
          <span className="pointer-events-none absolute -left-10 top-6 z-20 hidden w-48 rounded-md border border-slate-200 bg-white p-2 text-left text-[11px] font-body normal-case text-black/80 shadow-sm group-hover:block">
            {tooltip}
          </span>
        </span>
      </button>
    </th>
  );
}
