/**
 * Hardcoded design data for RS Wall calculations.
 * Not displayed in the UI; consumed by calculation utilities.
 */

export const reinforcementFactors = {
  ULS: {
    tensileStrength: 1.0,
    pulloutResistance: 1.0,
    connectionStrength: 0.9,
  },
  SLS: {
    tensileStrength: 1.0,
    pulloutResistance: 1.0,
    connectionStrength: 1.0,
  },
};

export const soilFactors = {
  ULS: {
    cohesion: 0.65,
    frictionAngle: 0.9,
    unitWeight: 1.0,
  },
  SLS: {
    cohesion: 1.0,
    frictionAngle: 1.0,
    unitWeight: 1.0,
  },
};

export const soilReinforcementFactors = {
  ULS: {
    interfaceFriction: 0.9,
    bearingCapacity: 0.9,
  },
  SLS: {
    interfaceFriction: 1.0,
    bearingCapacity: 1.0,
  },
};

export const safetyFactors = {
  ULS: {
    sliding: 1.5,
    overturning: 2.0,
    bearing: 2.5,
    pullout: 1.5,
    tensileRupture: 1.5,
  },
  SLS: {
    sliding: 1.2,
    overturning: 1.5,
    bearing: 2.0,
    pullout: 1.2,
    tensileRupture: 1.2,
  },
};

export const loadCombinations = {
  A: {
    deadLoad: 1.35,
    liveLoad: 1.5,
    stripLoad: 1.5,
    seismic: 0,
  },
  B: {
    deadLoad: 1.2,
    liveLoad: 1.2,
    stripLoad: 1.2,
    seismic: 1.0,
  },
  C: {
    deadLoad: 1.0,
    liveLoad: 1.0,
    stripLoad: 1.0,
    seismic: 0,
  },
};

export const SEISMIC_ZONE_OPTIONS = ['II', 'III', 'IV', 'V', 'VI'];

export const SEISMIC_ZONE_DATA = {
  II: { alpha0: 0.05, alpham: 0.07 },
  III: { alpha0: 0.12, alpham: 0.16 },
  IV: { alpha0: 0.12, alpham: 0.16 },
  V: { alpha0: 0.18, alpham: 0.23 },
  VI: { alpha0: 0.31, alpham: 0.35 },
};

export const CONCRETE_GRADES = ['M15', 'M20', 'M25', 'M30', 'M35', 'M40', 'M45', 'M50'];

export const LOAD_COMBINATION_OPTIONS = ['A', 'B', 'C'];

export const DESIGN_STATE_OPTIONS = ['ULS', 'SLS'];
