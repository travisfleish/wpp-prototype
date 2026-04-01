"use client";

import { CATEGORIES } from "@/lib/data/categories";
import { SelectMenu } from "@/components/filters/SelectMenu";
import { selectLabelClassName } from "@/components/filters/selectStyles";

type CategorySelectProps = {
  value?: string;
  onChange: (categoryId?: string) => void;
  disabled?: boolean;
};

export function CategorySelect({ value, onChange, disabled }: CategorySelectProps) {
  return (
    <div className="space-y-2">
      <label className={selectLabelClassName}>Category</label>
      <SelectMenu
        value={value}
        options={CATEGORIES.map((category) => ({ value: category.id, label: category.name }))}
        placeholder="Select category"
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
