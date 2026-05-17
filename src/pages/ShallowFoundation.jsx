import React, { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Page,
  Canvas,
  Header,
  Title,
  Subtitle,
  FormGrid,
  FormCard,
  Label,
  Input,
  Select,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  MetricsGrid,
  MetricCard,
  ErrorBanner,
  Readout,
  Hint,
} from './ShallowFoundation.styles';

const G = 9.807;

/**
 * Excel equivalent (Z = water table depth, E = depth of foundation, ρ = density t/m³):
 * IF(Z>=E, ρ*G, IF(Z=0,(ρ-1)*G, ((Z*ρ*G)+((E-Z)*(ρ-1)*G))/E))
 */
function densityIncludingWaterEffectKnPerM3(rhoTPerM3, depthFoundationM, waterTableDepthM) {
  const rho = parseFloat(rhoTPerM3);
  const E = parseFloat(depthFoundationM);
  const Z = parseFloat(waterTableDepthM);
  if (!Number.isFinite(rho) || !Number.isFinite(E) || !Number.isFinite(Z)) return null;
  if (E <= 0) return null;

  if (Z >= E) return rho * G;
  if (Math.abs(Z) < 1e-12) return (rho - 1) * G;
  return (Z * rho * G + (E - Z) * (rho - 1) * G) / E;
}

/**
 * Excel: DEGREES(ATAN(0.67 * TAN(RADIANS(phi))))  i.e. same as ATAN(...) * (180/PI)
 */
function mobilizedAngleOfShearingResistanceDeg(phiDeg) {
  const phi = parseFloat(phiDeg);
  if (!Number.isFinite(phi)) return null;
  return Math.atan(0.67 * Math.tan((phi * Math.PI) / 180)) * (180 / Math.PI);
}

const initialState = {
  foundationType: 'rectangular',
  depthFoundation: '',
  waterTableDepth: '',
  length: '',
  width: '',
  side: '',
  diameter: '',
  factorOfSafety: '3',
  densityAbove: '',
  densityBelow: '',
  cohesion: '',
  phiDegrees: '',
  voidRatio: '',
};

function ShallowFoundation() {
  const [inputs, setInputs] = useState(initialState);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFoundationType = (e) => {
    const foundationType = e.target.value;
    setInputs((prev) => ({ ...prev, foundationType }));
    setError('');
  };

  const resetForm = () => {
    setInputs(initialState);
    setError('');
  };

  const gammaAbove = useMemo(
    () => densityIncludingWaterEffectKnPerM3(inputs.densityAbove, inputs.depthFoundation, inputs.waterTableDepth),
    [inputs.densityAbove, inputs.depthFoundation, inputs.waterTableDepth]
  );

  const gammaBelow = useMemo(
    () => densityIncludingWaterEffectKnPerM3(inputs.densityBelow, inputs.depthFoundation, inputs.waterTableDepth),
    [inputs.densityBelow, inputs.depthFoundation, inputs.waterTableDepth]
  );

  const mobilizedPhiDeg = useMemo(
    () => mobilizedAngleOfShearingResistanceDeg(inputs.phiDegrees),
    [inputs.phiDegrees]
  );

  const geometrySummary = useMemo(() => {
    const { foundationType, length, width, side, diameter } = inputs;
    const L = parseFloat(length);
    const W = parseFloat(width);
    const S = parseFloat(side);
    const D = parseFloat(diameter);

    switch (foundationType) {
      case 'rectangular':
        if (Number.isFinite(L) && Number.isFinite(W) && L > 0 && W > 0) {
          return { label: 'Footprint', text: `${L} m × ${W} m (area ${(L * W).toFixed(3)} m²)` };
        }
        return { label: 'Footprint', text: 'Enter length and width (m).' };
      case 'square':
        if (Number.isFinite(S) && S > 0) {
          return { label: 'Footprint', text: `${S} m × ${S} m (area ${(S * S).toFixed(3)} m²)` };
        }
        return { label: 'Footprint', text: 'Enter side length (m).' };
      case 'strip':
        if (Number.isFinite(W) && W > 0) {
          return { label: 'Strip', text: `Width ${W} m (unit strip along length).` };
        }
        return { label: 'Strip', text: 'Enter width B (m).' };
      case 'circular':
        if (Number.isFinite(D) && D > 0) {
          const r = D / 2;
          return { label: 'Circular', text: `Diameter ${D} m (area ${(Math.PI * r * r).toFixed(3)} m²).` };
        }
        return { label: 'Circular', text: 'Enter diameter (m).' };
      default:
        return { label: '—', text: '—' };
    }
  }, [inputs]);

  const validate = () => {
    const Df = parseFloat(inputs.depthFoundation);
    const Z = parseFloat(inputs.waterTableDepth);
    const fs = parseFloat(inputs.factorOfSafety);
    const rhoA = parseFloat(inputs.densityAbove);
    const rhoB = parseFloat(inputs.densityBelow);

    if (!Number.isFinite(Df) || Df <= 0) {
      setError('Depth of foundation must be a positive number (m).');
      return false;
    }
    if (!Number.isFinite(Z) || Z < 0) {
      setError('Water table depth must be zero or positive (m from surface).');
      return false;
    }
    if (!Number.isFinite(fs) || fs <= 0) {
      setError('Factor of safety must be positive.');
      return false;
    }
    if (!Number.isFinite(rhoA) || rhoA <= 0 || !Number.isFinite(rhoB) || rhoB <= 0) {
      setError('Densities above and below foundation level must be positive (t/m³).');
      return false;
    }

    const { foundationType, length, width, side, diameter } = inputs;
    const L = parseFloat(length);
    const W = parseFloat(width);
    const S = parseFloat(side);
    const Di = parseFloat(diameter);

    if (foundationType === 'rectangular') {
      if (!Number.isFinite(L) || !Number.isFinite(W) || L <= 0 || W <= 0) {
        setError('Rectangular footing: enter positive length and width (m).');
        return false;
      }
    }
    if (foundationType === 'square') {
      if (!Number.isFinite(S) || S <= 0) {
        setError('Square footing: enter positive side length (m).');
        return false;
      }
    }
    if (foundationType === 'strip') {
      if (!Number.isFinite(W) || W <= 0) {
        setError('Strip footing: enter positive width B (m).');
        return false;
      }
    }
    if (foundationType === 'circular') {
      if (!Number.isFinite(Di) || Di <= 0) {
        setError('Circular footing: enter positive diameter (m).');
        return false;
      }
    }

    const c = parseFloat(inputs.cohesion);
    const phi = parseFloat(inputs.phiDegrees);
    const e = parseFloat(inputs.voidRatio);
    if (!Number.isFinite(c) || c < 0) {
      setError('Cohesion must be zero or positive (kPa).');
      return false;
    }
    if (!Number.isFinite(phi) || phi < 0 || phi > 89.99) {
      setError('Angle of shearing resistance must be between 0° and 90° (exclusive of 90°).');
      return false;
    }
    if (!Number.isFinite(e) || e <= 0) {
      setError('Void ratio must be positive.');
      return false;
    }

    setError('');
    return true;
  };

  const handleApply = () => {
    validate();
  };

  const fsDisplay = parseFloat(inputs.factorOfSafety);
  const fsOk = Number.isFinite(fsDisplay) && fsDisplay > 0;

  return (
    <>
      <Navbar />
      <Page>
        <Canvas>
          <Header>
            <Title>Shallow foundation capacity</Title>
            <Subtitle>
              Foundation geometry, embedment, water table, factor of safety, soil densities (t/m³), and strength
              parameters. Equivalent unit weights with water and mobilized shearing angle follow your spreadsheet rules.
            </Subtitle>
          </Header>

          <FormGrid>
            <FormCard>
              <h3>Foundation and embedment</h3>
              <Label>
                Type of foundation
                <Select name="foundationType" value={inputs.foundationType} onChange={handleFoundationType}>
                  <option value="rectangular">Rectangular</option>
                  <option value="square">Square</option>
                  <option value="strip">Strip</option>
                  <option value="circular">Circular</option>
                </Select>
              </Label>
              <Label>
                Depth of foundation (m)
                <Input
                  name="depthFoundation"
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.depthFoundation}
                  onChange={handleChange}
                  placeholder="e.g. 1.5"
                />
              </Label>
              <Label>
                Water table depth for calculation (m from surface)
                <Input
                  name="waterTableDepth"
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.waterTableDepth}
                  onChange={handleChange}
                  placeholder="e.g. 0.8"
                />
              </Label>
              <Label>
                Factor of safety
                <Input
                  name="factorOfSafety"
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.factorOfSafety}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                />
              </Label>
            </FormCard>

            <FormCard>
              <h3>Geometry (m)</h3>
              {inputs.foundationType === 'rectangular' && (
                <>
                  <Label>
                    Length (m)
                    <Input name="length" type="number" min="0" step="any" value={inputs.length} onChange={handleChange} placeholder="e.g. 2.4" />
                  </Label>
                  <Label>
                    Width (m)
                    <Input name="width" type="number" min="0" step="any" value={inputs.width} onChange={handleChange} placeholder="e.g. 1.8" />
                  </Label>
                </>
              )}
              {inputs.foundationType === 'square' && (
                <Label>
                  Side length (m)
                  <Input name="side" type="number" min="0" step="any" value={inputs.side} onChange={handleChange} placeholder="e.g. 2.0" />
                </Label>
              )}
              {inputs.foundationType === 'strip' && (
                <Label>
                  Width B (m)
                  <Input name="width" type="number" min="0" step="any" value={inputs.width} onChange={handleChange} placeholder="e.g. 1.2" />
                </Label>
              )}
              {inputs.foundationType === 'circular' && (
                <Label>
                  Diameter (m)
                  <Input name="diameter" type="number" min="0" step="any" value={inputs.diameter} onChange={handleChange} placeholder="e.g. 1.5" />
                </Label>
              )}
              <Readout>
                {geometrySummary.label}: {geometrySummary.text}
              </Readout>
            </FormCard>

            <FormCard>
              <h3>Densities (t/m³)</h3>
              <Label>
                Density above foundation level (t/m³)
                <Input
                  name="densityAbove"
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.densityAbove}
                  onChange={handleChange}
                  placeholder="e.g. 1.85"
                />
              </Label>
              {gammaAbove !== null ? (
                <Readout>Density including water effect: {gammaAbove.toFixed(4)} kN/m³</Readout>
              ) : (
                <Readout>Density including water effect: — (enter Df, Z, and density)</Readout>
              )}
              <Hint>
                If Z ≥ Df: ρ×9.807. If Z = 0: (ρ−1)×9.807. Else: (Z·ρ·9.807 + (Df−Z)·(ρ−1)·9.807) / Df — Z = water table depth, Df = depth of foundation.
              </Hint>

              <Label style={{ marginTop: '0.75rem' }}>
                Density below foundation level (t/m³)
                <Input
                  name="densityBelow"
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.densityBelow}
                  onChange={handleChange}
                  placeholder="e.g. 1.92"
                />
              </Label>
              {gammaBelow !== null ? (
                <Readout>Density including water effect: {gammaBelow.toFixed(4)} kN/m³</Readout>
              ) : (
                <Readout>Density including water effect: — (enter Df, Z, and density)</Readout>
              )}
              <Hint>Same piecewise rule using density below foundation level.</Hint>
            </FormCard>

            <FormCard>
              <h3>Strength and state</h3>
              <Label>
                Cohesion (kPa)
                <Input
                  name="cohesion"
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.cohesion}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                />
              </Label>
              <Label>
                Angle of shearing resistance ϕ (°)
                <Input
                  name="phiDegrees"
                  type="number"
                  min="0"
                  max="89.9"
                  step="any"
                  value={inputs.phiDegrees}
                  onChange={handleChange}
                  placeholder="e.g. 32"
                />
              </Label>
              {mobilizedPhiDeg !== null ? (
                <Readout>Mobilized angle of shearing resistance: {mobilizedPhiDeg.toFixed(4)}°</Readout>
              ) : (
                <Readout>Mobilized angle of shearing resistance: — (enter ϕ)</Readout>
              )}
              <Hint>ATAN(0.67 × TAN(RADIANS(ϕ))) in degrees (same as your Excel).</Hint>
              <Label style={{ marginTop: '0.75rem' }}>
                Void ratio e
                <Input
                  name="voidRatio"
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.voidRatio}
                  onChange={handleChange}
                  placeholder="e.g. 0.65"
                />
              </Label>
            </FormCard>
          </FormGrid>

          {error && <ErrorBanner>{error}</ErrorBanner>}

          <ButtonRow>
            <PrimaryButton type="button" onClick={handleApply}>
              Check inputs
            </PrimaryButton>
            <SecondaryButton type="button" onClick={resetForm}>
              Reset
            </SecondaryButton>
          </ButtonRow>

          <MetricsGrid>
            <MetricCard>
              <span>γ above (with water), kN/m³</span>
              <h3>{gammaAbove !== null ? gammaAbove.toFixed(3) : '—'}</h3>
            </MetricCard>
            <MetricCard>
              <span>γ below (with water), kN/m³</span>
              <h3>{gammaBelow !== null ? gammaBelow.toFixed(3) : '—'}</h3>
            </MetricCard>
            <MetricCard>
              <span>Factor of safety (stored)</span>
              <h3>{fsOk ? fsDisplay : '—'}</h3>
            </MetricCard>
            <MetricCard>
              <span>Mobilized ϕ (°)</span>
              <h3>{mobilizedPhiDeg !== null ? mobilizedPhiDeg.toFixed(3) : '—'}</h3>
            </MetricCard>
          </MetricsGrid>
        </Canvas>
      </Page>
    </>
  );
}

export default ShallowFoundation;
