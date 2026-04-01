"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { selectFieldClassName } from "@/components/filters/selectStyles";

type SelectOption = {
  value: string;
  label: string;
};

type SelectMenuProps = {
  value?: string;
  options: SelectOption[];
  placeholder: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
};

export function SelectMenu({ value, options, placeholder, onChange, disabled }: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label ?? placeholder,
    [options, placeholder, value],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={`${selectFieldClassName} flex items-center justify-between text-left`}
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "text-black" : "text-black/55"}>{selectedLabel}</span>
        <span className="ml-3 text-black/70">{open ? "▲" : "▼"}</span>
      </button>

      {open && !disabled && (
        <div className="absolute z-40 mt-1 w-full overflow-hidden rounded-md border border-slate-300 bg-white shadow-lg">
          <ul role="listbox" className="max-h-64 overflow-auto py-1">
            <li>
              <button
                type="button"
                className={`w-full px-3 py-2 text-left text-sm font-body transition-colors hover:bg-slate-100 ${
                  !value ? "bg-black text-white hover:bg-black/90" : "text-black"
                }`}
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                {placeholder}
              </button>
            </li>
            {options.map((option) => {
              const selected = value === option.value;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`w-full px-3 py-2 text-left text-sm font-body transition-colors hover:bg-slate-100 ${
                      selected ? "bg-black text-white hover:bg-black/90" : "text-black"
                    }`}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
