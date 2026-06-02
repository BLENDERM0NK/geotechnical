import {
  reinforcementFactors,
  soilFactors,
  soilReinforcementFactors,
  safetyFactors,
  loadCombinations,
} from './rsWallConstants';

/**
 * Resolves active design factors for a load combination and limit state.
 * Used by layerwise and future stability checks.
 */
export function getActiveDesignFactors(loadCombination, designState) {
  const combo = loadCombinations[loadCombination];
  const state = designState;
  if (!combo || !state) return null;

  return {
    loadCombination: combo,
    reinforcement: reinforcementFactors[state] ?? {},
    soil: soilFactors[state] ?? {},
    soilReinforcement: soilReinforcementFactors[state] ?? {},
    safety: safetyFactors[state] ?? {},
  };
}

/**
 * Layerwise reinforcement geometry (external stability — layerwise).
 * @param {{ H: number, Zj: number, Sv: number }} params
 * @returns {Array<{ layerFromBottom: number, zj: number, hj: number, svj: number, L: number }>}
 */
export function generateLayerwiseRows({ H, Zj, Sv }) {
  if (!Number.isFinite(H) || H <= 0) return [];
  if (!Number.isFinite(Zj) || Zj < 0) return [];
  if (!Number.isFinite(Sv) || Sv <= 0) return [];

  const rows = [];
  let zj = Zj;
  let layerFromBottom = 1;

  while (true) {
    const hj = H - zj;
    const L = Math.max(0.7 * hj, 3.0);

    rows.push({
      layerFromBottom,
      zj: Number(zj.toFixed(4)),
      hj: Number(hj.toFixed(4)),
      svj: Number(Sv.toFixed(4)),
      L: Number(L.toFixed(4)),
    });

    const nextZj = zj + Sv;
    if (nextZj > H) break;

    zj = nextZj;
    layerFromBottom += 1;
  }

  return rows;
}

export function computeWallHeightAboveGL(H, Dm) {
  const hVal = parseFloat(H);
  if (!Number.isFinite(hVal)) return null;
  const dmVal = Dm === '' || Dm === null || Dm === undefined ? 0 : parseFloat(Dm);
  if (!Number.isFinite(dmVal)) return null;
  return Number((hVal - dmVal).toFixed(4));
}

export function computeMechanicalHeight(H, Trm) {
  const hVal = parseFloat(H);
  if (!Number.isFinite(hVal)) return null;
  const trmVal = Trm === '' || Trm === null || Trm === undefined ? 0 : parseFloat(Trm);
  if (!Number.isFinite(trmVal)) return null;
  return Number((hVal + trmVal).toFixed(4));
}
