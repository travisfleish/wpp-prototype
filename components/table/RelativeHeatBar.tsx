"use client";

type RelativeHeatBarProps = {
  value: number;
  baseline: number;
  min: number;
  max: number;
};

export function RelativeHeatBar({ value, baseline, min, max }: RelativeHeatBarProps) {
  const safeMin = Number.isFinite(min) ? min : baseline;
  const safeMax = Number.isFinite(max) ? max : baseline;
  const belowRange = Math.max(baseline - safeMin, 0.0001);
  const aboveRange = Math.max(safeMax - baseline, 0.0001);

  const isAboveAverage = value >= baseline;
  const clampedValue = Math.min(Math.max(value, safeMin), safeMax);
  const magnitude = isAboveAverage
    ? Math.min((clampedValue - baseline) / aboveRange, 1)
    : Math.min((baseline - clampedValue) / belowRange, 1);

  const intensity = 0.2 + magnitude * 0.75;
  const fillColor = isAboveAverage
    ? `rgba(220, 38, 38, ${intensity})`
    : `rgba(37, 99, 235, ${intensity})`;
  const fillShadow = isAboveAverage ? "rgba(220, 38, 38, 0.28)" : "rgba(37, 99, 235, 0.28)";
  const sideWidth = `${magnitude * 50}%`;

  return (
    <span
      className="relative block h-2.5 w-28 overflow-hidden rounded-full"
      title={`${isAboveAverage ? "Above" : "Below"} typical by ${Math.abs(value - baseline).toFixed(2)}`}
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-300/70" />
      <span
        className="absolute inset-y-0 left-1/2 -translate-x-full rounded-l-full"
        style={{
          width: isAboveAverage ? "0%" : sideWidth,
          backgroundColor: fillColor,
          boxShadow: `0 0 8px ${fillShadow}`,
        }}
      />
      <span
        className="absolute inset-y-0 left-1/2 rounded-r-full"
        style={{
          width: isAboveAverage ? sideWidth : "0%",
          backgroundColor: fillColor,
          boxShadow: `0 0 8px ${fillShadow}`,
        }}
      />
    </span>
  );
}
