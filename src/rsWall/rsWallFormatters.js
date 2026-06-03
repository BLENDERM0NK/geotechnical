/**
 * Formatting helpers for RS Wall external stability results.
 */
function formatNumber(value, decimals) {
  if (value === null || value === undefined) return '—';
  if (value === Number.POSITIVE_INFINITY) return '∞';
  if (!Number.isFinite(value)) return '—';
  return Number(value).toFixed(decimals);
}

export function fmt2(value) {
  return formatNumber(value, 2);
}

export function fmt3(value) {
  return formatNumber(value, 3);
}

/**
 * Extract reinforced fill, retained, and foundation soil from editable table rows.
 */
export function parseSoilRoles(soilRows) {
  const reinforced = soilRows?.[0] ?? {};
  const retained = soilRows?.[1] ?? {};
  const foundation = soilRows?.[2] ?? {};

  return {
    gammaRf: parseFloat(reinforced.gamma) || 0,
    phiRfDeg: parseFloat(reinforced.phi) || 0,
    gammaRet: parseFloat(retained.gamma) || 0,
    phiFoundationDeg: parseFloat(foundation.phi) || 0,
  };
}
