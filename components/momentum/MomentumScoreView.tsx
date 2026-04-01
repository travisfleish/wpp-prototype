"use client";

import { useMemo, useState } from "react";

import type { Brand } from "@/lib/types";
import { getMockMomentumData, type MomentumPoint } from "@/lib/data/mockMomentum";
import { formatBrandDisplayName } from "@/lib/text";

type MomentumScoreViewProps = {
  brand: Brand;
};

const CHART_WIDTH = 860;
const CHART_HEIGHT = 460;
const PLOT = { top: 36, right: 28, bottom: 52, left: 64 };
const BUBBLE_MIN_RADIUS = 7;
const BUBBLE_MAX_RADIUS = 46;
const BUBBLE_SIZE_EXPONENT = 1.45;

const QUADRANT_LABELS = [
  { x: 0.78, y: 0.16, label: "Scale Winners" },
  { x: 0.24, y: 0.16, label: "Loyal Niche" },
  { x: 0.78, y: 0.84, label: "Leaky Growth" },
  { x: 0.24, y: 0.84, label: "Turnaround" },
];

function getDomain(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const low = Math.min(min - 1.5, 0);
  const high = Math.max(max + 1.5, 0);
  return { min: low, max: high };
}

function interpolateHex(from: string, to: string, t: number) {
  const normalized = Math.min(1, Math.max(0, t));
  const fromRgb = from.match(/[A-Za-z0-9]{2}/g)?.map((part) => parseInt(part, 16)) ?? [0, 0, 0];
  const toRgb = to.match(/[A-Za-z0-9]{2}/g)?.map((part) => parseInt(part, 16)) ?? [0, 0, 0];
  const mixed = fromRgb.map((channel, idx) =>
    Math.round(channel + (toRgb[idx] - channel) * normalized)
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${mixed.join("")}`;
}

export function MomentumScoreView({ brand }: MomentumScoreViewProps) {
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  const points = useMemo(() => getMockMomentumData(brand.id), [brand.id]);
  const selectedPoint =
    points.find((point) => point.communityId === selectedPointId) ?? null;
  const hoveredPoint = points.find((point) => point.communityId === hoveredPointId) ?? null;
  const comparisonPoint =
    hoveredPoint && hoveredPoint.communityId !== selectedPointId ? hoveredPoint : null;

  const growthDomain = useMemo(() => getDomain(points.map((point) => point.growth)), [points]);
  const retentionDomain = useMemo(
    () => getDomain(points.map((point) => point.retention)),
    [points],
  );
  const scoreDomain = useMemo(() => getDomain(points.map((point) => point.momentumScore)), [points]);
  const audienceDomain = useMemo(
    () => getDomain(points.map((point) => point.audiencePercent)),
    [points],
  );

  const plotWidth = CHART_WIDTH - PLOT.left - PLOT.right;
  const plotHeight = CHART_HEIGHT - PLOT.top - PLOT.bottom;

  const getX = (growth: number) =>
    PLOT.left + ((growth - growthDomain.min) / (growthDomain.max - growthDomain.min || 1)) * plotWidth;
  const getY = (retention: number) =>
    PLOT.top +
    (1 - (retention - retentionDomain.min) / (retentionDomain.max - retentionDomain.min || 1)) * plotHeight;
  const getRadius = (score: number) => {
    const normalized = (score - scoreDomain.min) / (scoreDomain.max - scoreDomain.min || 1);
    const weighted = Math.pow(Math.min(1, Math.max(0, normalized)), BUBBLE_SIZE_EXPONENT);
    return BUBBLE_MIN_RADIUS + weighted * (BUBBLE_MAX_RADIUS - BUBBLE_MIN_RADIUS);
  };
  const getColor = (audiencePercent: number) =>
    interpolateHex(
      "fee2e2",
      "b91c1c",
      (audiencePercent - audienceDomain.min) / (audienceDomain.max - audienceDomain.min || 1),
    );

  const growthThreshold = (growthDomain.min + growthDomain.max) / 2;
  const retentionThreshold = (retentionDomain.min + retentionDomain.max) / 2;
  const quadrantX = PLOT.left + plotWidth / 2;
  const quadrantY = PLOT.top + plotHeight / 2;

  return (
    <section className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white px-5 py-4">
        <h1 className="font-heading text-2xl text-black">Momentum Score</h1>
        <p className="mt-1 text-sm text-black/70">
          Mock view for {formatBrandDisplayName(brand.name)}: each bubble is a sports community.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="h-auto w-full">
          <rect
            x={PLOT.left}
            y={PLOT.top}
            width={plotWidth}
            height={plotHeight}
            fill="#f8fafc"
            rx="12"
          />
          <line
            x1={PLOT.left}
            y1={CHART_HEIGHT - PLOT.bottom}
            x2={CHART_WIDTH - PLOT.right}
            y2={CHART_HEIGHT - PLOT.bottom}
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <line
            x1={PLOT.left}
            y1={PLOT.top}
            x2={PLOT.left}
            y2={CHART_HEIGHT - PLOT.bottom}
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <line
            x1={PLOT.left}
            y1={quadrantY}
            x2={CHART_WIDTH - PLOT.right}
            y2={quadrantY}
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <line
            x1={quadrantX}
            y1={PLOT.top}
            x2={quadrantX}
            y2={CHART_HEIGHT - PLOT.bottom}
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {QUADRANT_LABELS.map((label) => (
            <text
              key={label.label}
              x={PLOT.left + plotWidth * label.x}
              y={PLOT.top + plotHeight * label.y}
              textAnchor="middle"
              className="fill-slate-500 text-[11px] font-medium"
            >
              {label.label}
            </text>
          ))}

          {points.map((point) => {
            const radius = getRadius(point.momentumScore);
            const x = getX(point.growth);
            const y = getY(point.retention);
            const isHovered = hoveredPointId === point.communityId;

            return (
              <g
                key={point.communityId}
                onMouseEnter={() => setHoveredPointId(point.communityId)}
                onMouseLeave={() => setHoveredPointId(null)}
                onClick={() => setSelectedPointId(point.communityId)}
                className="cursor-pointer"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: isHovered ? "scale(1.06)" : "scale(1)",
                  transition: "transform 150ms ease-out",
                }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={getColor(point.audiencePercent)}
                  fillOpacity={0.75}
                />
                <text x={x} y={y + 4} textAnchor="middle" className="fill-slate-900 text-[10px] font-semibold">
                  {point.communityName}
                </text>
              </g>
            );
          })}

          <text x={CHART_WIDTH / 2} y={CHART_HEIGHT - 14} textAnchor="middle" className="fill-slate-700 text-xs">
            Growth (Acquisition)
          </text>
          <text
            x={16}
            y={CHART_HEIGHT / 2}
            textAnchor="middle"
            transform={`rotate(-90 16 ${CHART_HEIGHT / 2})`}
            className="fill-slate-700 text-xs"
          >
            Retention
          </text>
        </svg>

        <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-black/75">
          <span>
            Bubble size: <strong>Momentum Score</strong>
          </span>
          <span>
            Bubble color: <strong>% Audience</strong> (light red low to deep red high)
          </span>
          <span>
            Dashed lines: <strong>midpoint thresholds</strong> that split the chart into equal quadrants
          </span>
        </div>

        {selectedPoint ? (
          <MomentumTooltip point={selectedPoint} label="Selected" comparisonPoint={comparisonPoint} />
        ) : (
          hoveredPoint && <MomentumTooltip point={hoveredPoint} />
        )}
      </div>

      {selectedPoint ? (
        <MomentumCommunityTable
          point={selectedPoint}
          growthThreshold={growthThreshold}
          retentionThreshold={retentionThreshold}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-black/65">
          Click a bubble to expand community details below.
        </div>
      )}
    </section>
  );
}

function MomentumTooltip({
  point,
  label,
  comparisonPoint,
}: {
  point: MomentumPoint;
  label?: string;
  comparisonPoint?: MomentumPoint | null;
}) {
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
      {label && (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      )}
      <p className="font-semibold text-black">{point.communityName}</p>
      <p className="mt-1 text-black/70">
        Growth: <span className="font-medium text-black">{point.growth.toFixed(1)}</span> | Retention:{" "}
        <span className="font-medium text-black">{point.retention.toFixed(1)}</span> | Momentum:{" "}
        <span className="font-medium text-black">{point.momentumScore.toFixed(0)}</span> | % Audience:{" "}
        <span className="font-medium text-black">{point.audiencePercent.toFixed(1)}%</span>
      </p>
      {comparisonPoint && (
        <div className="mt-3 border-t border-slate-200 pt-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Hover Compare
          </p>
          <p className="font-semibold text-black">{comparisonPoint.communityName}</p>
          <p className="mt-1 text-black/70">
            Growth: <span className="font-medium text-black">{comparisonPoint.growth.toFixed(1)}</span> |
            Retention:{" "}
            <span className="font-medium text-black">{comparisonPoint.retention.toFixed(1)}</span> | Momentum:{" "}
            <span className="font-medium text-black">{comparisonPoint.momentumScore.toFixed(0)}</span> |
            % Audience: <span className="font-medium text-black">{comparisonPoint.audiencePercent.toFixed(1)}%</span>
          </p>
        </div>
      )}
    </div>
  );
}

function MomentumCommunityTable({
  point,
  growthThreshold,
  retentionThreshold,
}: {
  point: MomentumPoint;
  growthThreshold: number;
  retentionThreshold: number;
}) {
  const quadrant =
    point.growth >= growthThreshold && point.retention >= retentionThreshold
      ? "Top Right (Scale Winners)"
      : point.growth < growthThreshold && point.retention >= retentionThreshold
        ? "Top Left (Loyal Niche)"
        : point.growth >= growthThreshold && point.retention < retentionThreshold
          ? "Bottom Right (Leaky Growth)"
          : "Bottom Left (Turnaround)";

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="font-heading text-xl text-black">{point.communityName} Detail</h2>
        <p className="text-sm text-black/65">Expanded community view for selected bubble</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-sm font-semibold text-black/80">
              <th className="px-4 py-3">Community</th>
              <th className="px-4 py-3">Growth</th>
              <th className="px-4 py-3">Retention</th>
              <th className="px-4 py-3">Momentum Score</th>
              <th className="px-4 py-3">% Audience</th>
              <th className="px-4 py-3">Quadrant</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm">
              <td className="px-4 py-3">{point.communityName}</td>
              <td className="px-4 py-3 tabular-nums">{point.growth.toFixed(1)}</td>
              <td className="px-4 py-3 tabular-nums">{point.retention.toFixed(1)}</td>
              <td className="px-4 py-3 tabular-nums">{point.momentumScore.toFixed(0)}</td>
              <td className="px-4 py-3 tabular-nums">{point.audiencePercent.toFixed(1)}%</td>
              <td className="px-4 py-3">{quadrant}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
