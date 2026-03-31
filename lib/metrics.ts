const percentile = (sortedValues: number[], p: number) => {
  if (!sortedValues.length) return 0;
  if (sortedValues.length === 1) return sortedValues[0];

  const index = (sortedValues.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) return sortedValues[lower];

  const weight = index - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
};

export const getRobustMetricScale = (values: number[]) => {
  const finiteValues = values.filter((value) => Number.isFinite(value));
  if (!finiteValues.length) {
    return { baseline: 0, min: 0, max: 0 };
  }

  const sorted = [...finiteValues].sort((a, b) => a - b);
  const dataMin = sorted[0];
  const dataMax = sorted[sorted.length - 1];

  const q1 = percentile(sorted, 0.25);
  const q3 = percentile(sorted, 0.75);
  const iqr = q3 - q1;

  // Use Tukey fences so extreme outliers don't flatten the chart.
  let robustMin = q1 - 1.5 * iqr;
  let robustMax = q3 + 1.5 * iqr;

  if (iqr === 0) {
    robustMin = percentile(sorted, 0.1);
    robustMax = percentile(sorted, 0.9);
  }

  const min = Math.max(dataMin, robustMin);
  const max = Math.min(dataMax, robustMax);

  if (min === max) {
    return {
      baseline: percentile(sorted, 0.5),
      min: dataMin,
      max: dataMax === dataMin ? dataMin + 1 : dataMax,
    };
  }

  const baseline = Math.min(Math.max(percentile(sorted, 0.5), min), max);
  return { baseline, min, max };
};
