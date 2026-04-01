"use client";

import { useMemo } from "react";

import { BRANDS } from "@/lib/data/brands";
import { SelectMenu } from "@/components/filters/SelectMenu";
import { formatBrandDisplayName } from "@/lib/text";
import { selectLabelClassName } from "@/components/filters/selectStyles";

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

  return (
    <div className="space-y-2">
      <label className={selectLabelClassName}>Brand</label>
      <SelectMenu
        value={value}
        options={sortedBrands.map((brand) => ({ value: brand.id, label: brand.displayName }))}
        placeholder="Select brand"
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
