"use client";

import { useMemo, useState } from "react";

import { BRANDS } from "@/lib/data/brands";
import { formatBrandDisplayName } from "@/lib/text";

type BrandSelectProps = {
  value?: string;
  onChange: (brandId?: string) => void;
  disabled?: boolean;
};

export function BrandSelect({
  value,
  onChange,
  disabled,
}: BrandSelectProps) {
  const [query, setQuery] = useState("");

  const brandsWithDisplayName = useMemo(
    () =>
      BRANDS.map((brand) => ({
        ...brand,
        displayName: formatBrandDisplayName(brand.name),
      })),
    [],
  );

  const sortedBrands = useMemo(
    () =>
      [...brandsWithDisplayName].sort((a, b) =>
        a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }),
      ),
    [brandsWithDisplayName],
  );

  const filteredBrands = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return sortedBrands;
    return sortedBrands.filter((brand) =>
      brand.displayName.toLowerCase().includes(normalizedQuery),
    );
  }, [query, sortedBrands]);

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-black/70">Brand</label>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search brands..."
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:border-accent focus:outline-none"
        disabled={disabled}
      />
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || undefined)}
        disabled={disabled}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select brand</option>
        {filteredBrands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}
