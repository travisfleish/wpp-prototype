"use client";

import { Button } from "@genius-sports/gs-marketing-ui";

export type AudienceViewMode = "standard" | "propensity";

type ViewToggleProps = {
  value: AudienceViewMode;
  onChange: (view: AudienceViewMode) => void;
};

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-black/70">View</label>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={value === "standard" ? "solidAccent" : "outlineOnDark"}
          onClick={() => onChange("standard")}
          type="button"
          className="w-full"
        >
          Standard
        </Button>
        <Button
          variant={value === "propensity" ? "solidAccent" : "outlineOnDark"}
          onClick={() => onChange("propensity")}
          type="button"
          className="w-full"
        >
          Propensity Score
        </Button>
      </div>
    </div>
  );
}
