import {
  RV_LOAD_FACTORS,
  RH_LOAD_FACTORS,
  soilReinforcementFactors,
  EXTERNAL_STABILITY_LIMITS,
  LENGTH_ITERATION_STEP,
  MAX_LENGTH_ITERATIONS,
} from './rsWallConstants';
import { parseSoilRoles } from './rsWallFormatters';

const { eccentricityRatio, overturningRatio, slidingFos: slidingFosLimit } = EXTERNAL_STABILITY_LIMITS;

function activeEarthPressureCoeff(phiDeg) {
  const phiRad = (phiDeg * Math.PI) / 180;
  const sinPhi = Math.sin(phiRad);
  const denom = 1 + sinPhi;
  if (Math.abs(denom) < 1e-12) return 0;
  return (1 - sinPhi) / denom;
}

function getLoadFactor(factorMap, component, loadCombination) {
  return factorMap[component]?.[loadCombination] ?? 0;
}

/**
 * Compute vertical and horizontal force components at a given reinforcement length L.
 */
export function computeForceComponents({
  L,
  hj,
  loadCombination,
  gammaRf,
  gammaRet,
  phiRfDeg,
  DL,
  LL,
  SL,
  bf,
}) {
  const Ka = activeEarthPressureCoeff(phiRfDeg);

  const lfV1 = getLoadFactor(RV_LOAD_FACTORS, 'V1', loadCombination);
  const lfV2 = getLoadFactor(RV_LOAD_FACTORS, 'V2', loadCombination);
  const lfV3 = getLoadFactor(RV_LOAD_FACTORS, 'V3', loadCombination);
  const lfV4 = getLoadFactor(RV_LOAD_FACTORS, 'V4', loadCombination);

  const V1 = L * hj * gammaRf * lfV1;
  const V2 = DL * L * lfV2;
  const V3 = LL * L * lfV3;
  const V4 = SL * bf * lfV4;

  const lfH1 = getLoadFactor(RH_LOAD_FACTORS, 'H1', loadCombination);
  const lfH2 = getLoadFactor(RH_LOAD_FACTORS, 'H2', loadCombination);
  const lfH3 = getLoadFactor(RH_LOAD_FACTORS, 'H3', loadCombination);

  const H1 = 0.5 * Ka * gammaRet * hj * hj * lfH1;
  const H2 = Ka * hj * DL * lfH2;
  const H3 = Ka * hj * LL * lfH3;

  const Rvj = V1 + V2 + V3 + V4;
  const Rhj = H1 + H2 + H3;

  return {
    Ka,
    V1,
    V2,
    V3,
    V4,
    H1,
    H2,
    H3,
    Rvj,
    Rhj,
    vLabels: {
      V1: 'Weight of Reinforced Soil Mass',
      V2: 'Weight of Fill on Reinforced Soil Mass',
      V3: 'Traffic Surcharge',
      V4: 'Weight of Crash Barrier',
    },
    hLabels: {
      H1: 'Soil Behind Reinforced Soil Mass',
      H2: 'Due to Dead Load',
      H3: 'Due to Traffic Surcharge',
    },
  };
}

/**
 * Compute moments, eccentricity, ratios, and sliding FOS at a given L.
 */
export function computeStabilityAtLength({
  L,
  hj,
  loadCombination,
  designState,
  gammaRf,
  gammaRet,
  phiRfDeg,
  phiFoundationDeg,
  DL,
  LL,
  SL,
  bf,
}) {
  const forces = computeForceComponents({
    L,
    hj,
    loadCombination,
    gammaRf,
    gammaRet,
    phiRfDeg,
    DL,
    LL,
    SL,
    bf,
  });

  const { V1, V2, V3, V4, H1, H2, H3, Rvj, Rhj } = forces;

  const Mr = V1 * (L / 2) + V2 * (L / 2) + V3 * (L / 2) + V4 * (bf / 2);
  const Mo = H1 * (hj / 3) + H2 * (hj / 2) + H3 * (hj / 2);

  const X = Rvj !== 0 ? (Mr - Mo) / Rvj : 0;
  const e = L / 2 - X;
  const eOverL = L !== 0 ? e / L : 0;

  const mrMo = Mo !== 0 ? Mr / Mo : Number.POSITIVE_INFINITY;

  const fs = soilReinforcementFactors.sliding[designState] ?? 1.0;
  const phiFoundationRad = (phiFoundationDeg * Math.PI) / 180;
  const tanPhiFoundation = Math.tan(phiFoundationRad);

  let slidingFos;
  if (Rhj === 0 || fs === 0) {
    slidingFos = Number.POSITIVE_INFINITY;
  } else {
    slidingFos = (Rvj * tanPhiFoundation) / (fs * Rhj);
  }

  return {
    ...forces,
    Mr,
    Mo,
    X,
    e,
    eOverL,
    mrMo,
    slidingFos,
    fs,
  };
}

function runLengthPhase(checkName, isSafe, getState, incrementLength, maxIterations) {
  let iterations = 0;
  let governingCheck = null;

  while (!isSafe(getState()) && iterations < maxIterations) {
    incrementLength();
    iterations += 1;
    governingCheck = checkName;
  }

  return {
    achieved: isSafe(getState()),
    governingCheck,
    iterations,
  };
}

/**
 * Iteratively increase L until eccentricity, overturning, and sliding checks pass.
 */
export function iterateReinforcementLength(params) {
  const { hj } = params;
  const initialL = Math.max(0.7 * hj, 3.0);
  let L = initialL;

  const getState = () =>
    computeStabilityAtLength({
      ...params,
      L,
    });

  let governingCheck = 'None';
  let designNotAchievable = false;

  const eccentricityPhase = runLengthPhase(
    'Eccentricity',
    (state) => state.eOverL <= eccentricityRatio,
    getState,
    () => {
      L += LENGTH_ITERATION_STEP;
    },
    MAX_LENGTH_ITERATIONS
  );

  if (!eccentricityPhase.achieved) {
    designNotAchievable = true;
  } else if (eccentricityPhase.governingCheck) {
    governingCheck = eccentricityPhase.governingCheck;
  }

  if (!designNotAchievable) {
    const overturningPhase = runLengthPhase(
      'Overturning',
      (state) => state.mrMo >= overturningRatio,
      getState,
      () => {
        L += LENGTH_ITERATION_STEP;
      },
      MAX_LENGTH_ITERATIONS
    );

    if (!overturningPhase.achieved) {
      designNotAchievable = true;
    } else if (overturningPhase.governingCheck) {
      governingCheck = overturningPhase.governingCheck;
    }
  }

  if (!designNotAchievable) {
    const slidingPhase = runLengthPhase(
      'Sliding',
      (state) => state.slidingFos >= slidingFosLimit,
      getState,
      () => {
        L += LENGTH_ITERATION_STEP;
      },
      MAX_LENGTH_ITERATIONS
    );

    if (!slidingPhase.achieved) {
      designNotAchievable = true;
    } else if (slidingPhase.governingCheck) {
      governingCheck = slidingPhase.governingCheck;
    }
  }

  const final = computeStabilityAtLength({ ...params, L });

  return {
    initialL,
    finalL: L,
    governingCheck: designNotAchievable ? null : governingCheck,
    designNotAchievable,
    eccentricitySafe: final.eOverL <= eccentricityRatio,
    overturningSafe: final.mrMo >= overturningRatio,
    slidingSafe: final.slidingFos >= slidingFosLimit,
    ...final,
  };
}

/**
 * Enrich base layerwise rows (cols 1–5) with external stability results (cols 6–16+).
 */
export function computeExternalStabilityRows({
  baseRows,
  loadCombination,
  designState,
  DL,
  LL,
  SL,
  bf,
  soilRows,
}) {
  const { gammaRf, phiRfDeg, gammaRet, phiFoundationDeg } = parseSoilRoles(soilRows);

  return baseRows.map((row) => {
    const result = iterateReinforcementLength({
      hj: row.hj,
      loadCombination,
      designState,
      gammaRf,
      gammaRet,
      phiRfDeg,
      phiFoundationDeg,
      DL,
      LL,
      SL,
      bf,
    });

    return {
      layerFromBottom: row.layerFromBottom,
      zj: row.zj,
      hj: row.hj,
      svj: row.svj,
      L: row.L,
      initialL: result.initialL,
      finalL: result.finalL,
      governingCheck: result.designNotAchievable ? 'DESIGN NOT ACHIEVABLE' : result.governingCheck,
      designNotAchievable: result.designNotAchievable,
      Rvj: result.Rvj,
      Rhj: result.Rhj,
      Mr: result.Mr,
      Mo: result.Mo,
      e: result.e,
      eOverL: result.eOverL,
      mrMo: result.mrMo,
      slidingFos: result.slidingFos,
      eccentricityStatus: result.designNotAchievable
        ? 'DESIGN NOT ACHIEVABLE'
        : result.eccentricitySafe
          ? 'SAFE'
          : 'UNSAFE',
      overturningStatus: result.designNotAchievable
        ? 'DESIGN NOT ACHIEVABLE'
        : result.overturningSafe
          ? 'SAFE'
          : 'UNSAFE',
      slidingStatus: result.designNotAchievable
        ? 'DESIGN NOT ACHIEVABLE'
        : result.slidingSafe
          ? 'SAFE'
          : 'UNSAFE',
      forceBreakdown: {
        V1: result.V1,
        V2: result.V2,
        V3: result.V3,
        V4: result.V4,
        vLabels: result.vLabels,
        H1: result.H1,
        H2: result.H2,
        H3: result.H3,
        hLabels: result.hLabels,
      },
    };
  });
}
