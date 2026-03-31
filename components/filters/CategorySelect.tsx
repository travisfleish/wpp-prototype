"use client";

import { useMemo, useState } from "react";

import { CATEGORIES } from "@/lib/data/categories";

type CategorySelectProps = {
  value?: string;
  onChange: (categoryId?: string) => void;
  disabled?: boolean;
};

export function CategorySelect({ value, onChange, disabled }: CategorySelectProps) {
  const [query, setQuery] = useState("");

  const visibleCategories = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return CATEGORIES;
    return CATEGORIES.filter((category) => category.name.toLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-black/70">Category</label>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search categories..."
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:border-accent focus:outline-none"
        disabled={disabled}
      />
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || undefined)}
        disabled={disabled}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select category</option>
        {visibleCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
