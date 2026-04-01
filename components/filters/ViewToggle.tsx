"use client";

import { Button } from "@genius-sports/gs-marketing-ui";

export type AudienceViewMode = "standard" | "momentum";

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
          className={
            value === "standard"
              ? "w-full !border-black !bg-black !text-white hover:!bg-black/90"
              : "w-full !border-slate-300 !bg-white !text-black hover:!bg-slate-50"
          }
        >
          Standard View
        </Button>
        <Button
          variant={value === "momentum" ? "solidAccent" : "outlineOnDark"}
          onClick={() => onChange("momentum")}
          type="button"
          className={
            value === "momentum"
              ? "w-full !border-black !bg-black !text-white hover:!bg-black/90"
              : "w-full !border-slate-300 !bg-white !text-black hover:!bg-slate-50"
          }
        >
          Momentum Score
        </Button>
      </div>
    </div>
  );
}
