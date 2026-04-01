"use client";

import { BrandSelect } from "@/components/filters/BrandSelect";
import { CategorySelect } from "@/components/filters/CategorySelect";
import { StateSelect } from "@/components/filters/StateSelect";
import { type AudienceViewMode, ViewToggle } from "@/components/filters/ViewToggle";

type FilterPanelProps = {
  selectedBrandId?: string;
  selectedCategoryId?: string;
  selectedStates: string[];
  viewMode: AudienceViewMode;
  onBrandChange: (brandId?: string) => void;
  onCategoryChange: (categoryId?: string) => void;
  onStatesChange: (states: string[]) => void;
  onViewModeChange: (view: AudienceViewMode) => void;
};

export function FilterPanel({
  selectedBrandId,
  selectedCategoryId,
  selectedStates,
  viewMode,
  onBrandChange,
  onCategoryChange,
  onStatesChange,
  onViewModeChange,
}: FilterPanelProps) {
  return (
    <div className="h-full overflow-auto bg-white p-5">
      <div className="space-y-5">
        <CategorySelect
          value={selectedCategoryId}
          onChange={(nextCategoryId) => {
            onCategoryChange(nextCategoryId);
            if (nextCategoryId) onBrandChange(undefined);
          }}
        />

        <BrandSelect
          value={selectedBrandId}
          onChange={(nextBrandId) => {
            onBrandChange(nextBrandId);
            if (nextBrandId) onCategoryChange(undefined);
          }}
        />

        <StateSelect selectedStates={selectedStates} onChange={onStatesChange} />

        <ViewToggle
          value={viewMode}
          momentumEnabled={Boolean(selectedBrandId)}
          onChange={onViewModeChange}
        />
      </div>
    </div>
  );
}
