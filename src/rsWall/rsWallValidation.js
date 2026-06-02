const ANGLE_MAX = 89.99;

function parsePositive(value, label, errors, allowZero = false) {
  const n = parseFloat(value);
  if (value === '' || value === null || value === undefined) {
    errors.push(`${label} is required.`);
    return null;
  }
  if (!Number.isFinite(n)) {
    errors.push(`${label} must be a valid number.`);
    return null;
  }
  if (allowZero ? n < 0 : n <= 0) {
    errors.push(`${label} must be ${allowZero ? 'zero or positive' : 'positive'}.`);
    return null;
  }
  return n;
}

function parseAngle(value, label, errors) {
  const n = parseFloat(value);
  if (value === '' || value === null || value === undefined) {
    errors.push(`${label} is required.`);
    return null;
  }
  if (!Number.isFinite(n) || n < 0 || n > ANGLE_MAX) {
    errors.push(`${label} must be between 0° and 90° (exclusive of 90°).`);
    return null;
  }
  return n;
}

function parseNonNegative(value, label, errors) {
  const n = parseFloat(value);
  if (value === '' || value === null || value === undefined) {
    errors.push(`${label} is required.`);
    return null;
  }
  if (!Number.isFinite(n) || n < 0) {
    errors.push(`${label} must be zero or positive.`);
    return null;
  }
  return n;
}

/** Empty field treated as 0 (typical for surcharges, cohesion, optional thickness). */
function parseNonNegativeOrZero(value, label, errors) {
  if (value === '' || value === null || value === undefined) {
    return 0;
  }
  const n = parseFloat(value);
  if (!Number.isFinite(n) || n < 0) {
    errors.push(`${label} must be zero or positive.`);
    return null;
  }
  return n;
}

/**
 * Validates all RS Wall inputs required before external stability calculation.
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateRsWallInputs(inputs) {
  const errors = [];

  const H = parsePositive(inputs.H, 'Design height of wall H', errors);
  const Dm = parseNonNegativeOrZero(inputs.Dm, 'Depth of embankment Dm', errors);
  const Trm = parseNonNegativeOrZero(inputs.Trm, 'Thickness of road material Trm', errors);

  if (Trm > 0) {
    parsePositive(inputs.gammaRm, 'Average unit weight of pavement γ_rm', errors);
  }

  if (H !== null && Dm !== null && Dm > H) {
    errors.push('Depth of embankment Dm cannot exceed design height H.');
  }

  parseAngle(inputs.omega, 'Wall inclination ω (from vertical)', errors);
  parseAngle(inputs.alpha, 'Wall inclination α (from horizontal)', errors);
  parseAngle(inputs.frontSlope, 'Front slope angle i', errors);
  parseAngle(inputs.backSlope, 'Back slope angle β', errors);

  if (!inputs.soilRows?.length) {
    errors.push('At least one soil parameter row is required.');
  } else {
    inputs.soilRows.forEach((row, idx) => {
      const rowLabel = `Soil row ${idx + 1}`;
      if (!row.soilData?.trim()) {
        errors.push(`${rowLabel}: soil description is required.`);
      }
      parseNonNegativeOrZero(row.cohesion, `${rowLabel} C′`, errors);
      parsePositive(row.gamma, `${rowLabel} γ`, errors);
      parseAngle(row.phi, `${rowLabel} φ`, errors);
    });
  }

  const SL = parseNonNegativeOrZero(inputs.SL, 'Strip loading SL', errors);
  parseNonNegativeOrZero(inputs.DL, 'Dead load surcharge DL', errors);
  parseNonNegativeOrZero(inputs.LL, 'Traffic surcharge LL', errors);
  parseNonNegativeOrZero(inputs.bf, 'Width of friction slab bf', errors);
  parseNonNegativeOrZero(inputs.d, 'Distance d to strip load centre', errors);

  if (SL > 0) {
    const bf = parseFloat(inputs.bf);
    const d = parseFloat(inputs.d);
    if (!Number.isFinite(bf) || bf <= 0) {
      errors.push('Width of friction slab bf must be positive when strip loading SL > 0.');
    }
    if (!Number.isFinite(d) || d < 0) {
      errors.push('Distance d must be specified when strip loading SL > 0.');
    }
  }

  if (!inputs.seismicZone) {
    errors.push('Seismic zone is required.');
  }

  parsePositive(inputs.Hp, 'Height of facing panel Hp', errors);
  parsePositive(inputs.Wp, 'Width of facing panel Wp', errors);
  if (!inputs.concreteGrade) {
    errors.push('Grade of concrete is required.');
  }

  const Zj = parseNonNegative(inputs.Zj, 'Height of first reinforcement layer Zj', errors);
  const Sv = parsePositive(inputs.Sv, 'Vertical spacing between layers Sv', errors);

  if (H !== null && Zj !== null && Zj > H) {
    errors.push('First reinforcement layer height Zj cannot exceed design height H.');
  }
  if (Sv !== null && Sv <= 0) {
    errors.push('Vertical spacing Sv must be positive.');
  }

  return { valid: errors.length === 0, errors };
}

export function validateLayerwiseSubmit(inputs) {
  return validateRsWallInputs(inputs);
}
