"use client";

import { US_STATES } from "@/lib/data/states";
import { selectLabelClassName } from "@/components/filters/selectStyles";

type StateSelectProps = {
  selectedStates: string[];
  onChange: (states: string[]) => void;
};

export function StateSelect({ selectedStates, onChange }: StateSelectProps) {
  function toggleState(state: string) {
    if (selectedStates.includes(state)) {
      onChange(selectedStates.filter((entry) => entry !== state));
      return;
    }
    onChange([...selectedStates, state]);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={selectLabelClassName}>States</label>
        {selectedStates.length > 0 && (
          <span className="rounded-full bg-accent/20 px-2 py-1 text-[10px] font-semibold text-accent">
            {selectedStates.length}
          </span>
        )}
      </div>
      <details className="rounded-md border border-slate-300 bg-white shadow-sm">
        <summary className="cursor-pointer list-none px-3 py-2 font-body text-sm text-black marker:content-none">
          {selectedStates.length > 0
            ? `${selectedStates.length} selected`
            : "Select states (optional)"}
        </summary>
        <div className="max-h-56 space-y-1 overflow-auto border-t border-slate-200 p-2">
          <button
            type="button"
            onClick={() => onChange([])}
            className="mb-1 text-[11px] font-heading uppercase tracking-wide text-accent hover:underline"
          >
            Clear all
          </button>
          {US_STATES.map((state) => {
            const checked = selectedStates.includes(state);
            return (
              <label
                key={state}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleState(state)}
                  className="accent-accent"
                />
                <span>{state}</span>
              </label>
            );
          })}
        </div>
      </details>
    </div>
  );
}
