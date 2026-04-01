"use client";

import { CATEGORIES } from "@/lib/data/categories";

type CategorySelectProps = {
  value?: string;
  onChange: (categoryId?: string) => void;
  disabled?: boolean;
};

export function CategorySelect({ value, onChange, disabled }: CategorySelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-black/70">Category</label>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || undefined)}
        disabled={disabled}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select category</option>
        {CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
