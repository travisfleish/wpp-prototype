"use client";

import { Button } from "@genius-sports/gs-marketing-ui";

export type AudienceViewMode = "standard" | "momentum";

type ViewToggleProps = {
  value: AudienceViewMode;
  momentumEnabled: boolean;
  onChange: (view: AudienceViewMode) => void;
};

export function ViewToggle({ value, momentumEnabled, onChange }: ViewToggleProps) {
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
          disabled={!momentumEnabled}
          className={
            value === "momentum"
              ? "w-full !border-black !bg-black !text-white hover:!bg-black/90 disabled:!border-slate-200 disabled:!bg-slate-100 disabled:!text-slate-400"
              : "w-full !border-slate-300 !bg-white !text-black hover:!bg-slate-50 disabled:!border-slate-200 disabled:!bg-slate-100 disabled:!text-slate-400"
          }
        >
          Momentum Score
        </Button>
      </div>
      {!momentumEnabled && (
        <p className="text-xs text-black/55">Momentum Score is available for brand audiences only.</p>
      )}
    </div>
  );
}
