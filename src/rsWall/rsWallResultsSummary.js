import { fmt2 } from './rsWallFormatters';

/**
 * Build design-level summary from pre-computed layerwise rows (display only).
 */
export function buildDesignSummary(rows) {
  if (!rows?.length) {
    return null;
  }

  const anyNotAchievable = rows.some((row) => row.designNotAchievable);
  const controllingRow = rows.reduce(
    (max, row) => (row.finalL > max.finalL ? row : max),
    rows[0]
  );

  return {
    designStatus: anyNotAchievable ? 'NOT ACHIEVABLE' : 'SAFE',
    controllingLayer: `Layer ${controllingRow.layerFromBottom}`,
    governingCheck: controllingRow.designNotAchievable
      ? '—'
      : controllingRow.governingCheck,
    maxRequiredL: Math.max(...rows.map((row) => row.finalL)),
  };
}

export function formatCheckResult(safeAtL) {
  if (safeAtL === null || safeAtL === undefined) {
    return { label: 'NOT ACHIEVABLE', variant: 'fail' };
  }
  return { label: `SAFE @ L = ${fmt2(safeAtL)} m`, variant: 'safe' };
}

export function formatGoverningCheck(value) {
  if (value === 'NOT ACHIEVABLE' || value === 'DESIGN NOT ACHIEVABLE') {
    return 'NOT ACHIEVABLE';
  }
  return value ?? 'None';
}
