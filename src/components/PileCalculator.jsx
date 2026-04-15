import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PileCylinderVisual from './PileCylinderVisual';
import {
  Container,
  Canvas,
  Header,
  Title,
  Subtitle,
  TagList,
  Tag,
  ContentGrid,
  SectionCard,
  SectionHeader,
  SectionTitle,
  FormGroup,
  StatGrid,
  StatCard,
  LayerContainer,
  LayerTitle,
  Info,
  CalculationResult,
  MaxOverburdenBox,
  Button,
  ButtonRow,
  AddLayerButton,
  EmptyState,
} from './PileCalculator.styles.js';

const soilTypes = [
  'High Plasticity Clay (CH)', 'Medium Plasticity Clay (CI)', 'Low Plasticity Clay (CL)',
  'Poorly Graded Sand (SP)', 'Well Graded Sand (SW)', 'Silty Sand (SM)'
];

const angleData = [
  { angle: 0, Nq: 1.00, Ng: 0.00 },
  { angle: 5, Nq: 1.57, Ng: 0.45 },
  { angle: 10, Nq: 2.47, Ng: 1.22 },
  { angle: 15, Nq: 3.94, Ng: 2.65 },
  { angle: 20, Nq: 6.40, Ng: 5.39 },
  { angle: 25, Nq: 10.03, Ng: 10.88 },
  { angle: 25.5, Nq: 10.79, Ng: 11.68 },
  { angle: 26, Nq: 11.62, Ng: 12.54 },
  { angle: 26.5, Nq: 12.51, Ng: 13.47 },
  { angle: 27, Nq: 13.46, Ng: 14.47 },
  { angle: 27.5, Nq: 14.49, Ng: 15.55 },
  { angle: 28, Nq: 15.60, Ng: 16.72 },
  { angle: 28.5, Nq: 16.79, Ng: 17.98 },
  { angle: 29, Nq: 18.08, Ng: 19.34 },
  { angle: 29.5, Nq: 19.46, Ng: 20.81 },
  { angle: 30, Nq: 20.95, Ng: 22.40 },
  { angle: 30.5, Nq: 21.78, Ng: 24.13 },
  { angle: 31, Nq: 23.93, Ng: 25.99 },
  { angle: 31.5, Nq: 26.29, Ng: 28.02 },
  { angle: 32, Nq: 28.88, Ng: 30.22 },
  { angle: 32.5, Nq: 31.73, Ng: 32.60 },
  { angle: 33, Nq: 34.86, Ng: 35.19 },
  { angle: 33.5, Nq: 38.30, Ng: 38.00 },
  { angle: 34, Nq: 42.08, Ng: 41.06 },
  { angle: 34.5, Nq: 46.23, Ng: 44.40 },
  { angle: 35, Nq: 48.50, Ng: 48.03 },
  { angle: 35.5, Nq: 55.80, Ng: 52.17 },
  { angle: 36, Nq: 61.31, Ng: 56.31 },
  { angle: 36.5, Nq: 67.36, Ng: 61.25 },
  { angle: 37, Nq: 74.01, Ng: 66.19 },
  { angle: 37.5, Nq: 81.31, Ng: 72.11 },
  { angle: 38, Nq: 89.33, Ng: 78.03 },
  { angle: 38.5, Nq: 98.40, Ng: 85.14 },
  { angle: 39, Nq: 107.83, Ng: 92.25 },
  { angle: 39.5, Nq: 118.47, Ng: 100.83 },
  { angle: 40, Nq: 130.16, Ng: 109.41 }
];

const interpolate = (input, data, key) => {
  if (isNaN(input)) return data[0][key];
  if (input <= data[0].angle) return data[0][key];
  if (input >= data[data.length - 1].angle) return data[data.length - 1][key];
  for (let i = 0; i < data.length - 1; i++) {
    const a = data[i], b = data[i + 1];
    if (input >= a.angle && input <= b.angle) {
      const ratio = (input - a.angle) / (b.angle - a.angle);
      return +(a[key] + ratio * (b[key] - a[key])).toFixed(2);
    }
  }
};

const getAlpha = (cohesion) => {
  if (isNaN(cohesion)) return 0;
  if (cohesion <= 40) return 1;
  if (cohesion >= 180) return 0.25;
  const range = [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180];
  const values = [1, 0.9, 0.75, 0.62, 0.55, 0.5, 0.45, 0.4, 0.35, 0.32, 0.3, 0.28, 0.27, 0.25, 0.25];
  for (let i = 0; i < range.length - 1; i++) {
    if (cohesion >= range[i] && cohesion <= range[i + 1]) {
      const ratio = (cohesion - range[i]) / (range[i + 1] - range[i]);
      return +(values[i] + ratio * (values[i + 1] - values[i])).toFixed(2);
    }
  }
  return 0.25;
};

/** Cumulative soil thickness from layer 0 through layer idx (inclusive), for pile sketch depth. */
const cumulativeLayerDepthM = (layerList, idx) => {
  let cum = 0;
  for (let i = 0; i <= idx; i += 1) {
    const h = parseFloat(layerList[i].thickness);
    if (Number.isFinite(h)) cum += h;
  }
  return cum;
};

export default function PileCalculator() {
  const [pile, setPile] = useState({ diameter: '', length: '', capThickness: '', criticalDepth: '', factor: 15 });
  const [layers, setLayers] = useState([]);
  const [maxOverburden, setMaxOverburden] = useState(0);
  const [pileVisualLayerIndex, setPileVisualLayerIndex] = useState(null);

  // new snapshot states
  const [totalDepth, setTotalDepth] = useState(0);
  const [overburdenAtDepth, setOverburdenAtDepth] = useState(0);

  useEffect(() => {
    if (layers.length === 0) {
      setPileVisualLayerIndex(null);
      return;
    }
    setPileVisualLayerIndex((i) => {
      if (i === null) return 0;
      if (i >= layers.length) return layers.length - 1;
      return i;
    });
  }, [layers.length]);

  const handlePileChange = (e) => {
    const { name, value } = e.target;
    const newPile = { ...pile, [name]: value };

    const parsedDiameter = parseFloat(name === 'diameter' ? value : pile.diameter) || 0;
    const parsedFactor = parseFloat(name === 'factor' ? value : pile.factor) || 15;

    newPile.criticalDepth = +(parsedDiameter * parsedFactor).toFixed(2);
    setPile(newPile);

    // when pile geometry changes, re-run layer recalculations to refresh Pd/Pdi/maxOverburden/snapshot
    // safe-guard: if layers exist, trigger update by re-setting layers copy (call updateLayer for each)
    if (layers.length > 0) {
      // force recompute by calling updateLayer for each layer field with same value
      const copy = [...layers];
      setLayers([]); // quick reset to ensure updateLayer will recompute; then restore
      setTimeout(() => setLayers(copy), 0);
    }
  };

  const addLayer = () => {
    const nextIndex = layers.length;
    setPileVisualLayerIndex(nextIndex);
    setLayers([
      ...layers,
      {
        soil: '', thickness: '', unitWeight: '', phi: '', cohesion: '',
        Nq: 0, Ng: 0, Ki: 1, alpha: 0, Asi: 0, Pd: 0, Pdi: 0,
        skinFriction: null, endBearing: null
      }
    ]);
  };

  const updateLayer = (index, field, value) => {
    const updated = [...layers];
    updated[index][field] = value;

    // parse current layer numeric inputs
    const phi = parseFloat(updated[index].phi);
    const cohesion = parseFloat(updated[index].cohesion);
    const thickness = parseFloat(updated[index].thickness);

    // Nq, Ng, Ki (Ki fixed at 1)
    if (!isNaN(phi)) {
      updated[index].Nq = interpolate(phi, angleData, 'Nq');
      updated[index].Ng = interpolate(phi, angleData, 'Ng');
      updated[index].Ki = 1;
    } else {
      updated[index].Nq = 0;
      updated[index].Ng = 0;
      updated[index].Ki = 1;
    }

    // alpha
    if (!isNaN(cohesion)) {
      updated[index].alpha = getAlpha(cohesion);
    } else {
      updated[index].alpha = 0;
    }

    // Asi (use numeric pile diameter)
    const Dnum = parseFloat(pile.diameter) || 0;
    if (!isNaN(thickness) && Dnum > 0) {
      updated[index].Asi = +(Math.PI * Dnum * thickness).toFixed(4);
    } else {
      updated[index].Asi = 0;
    }

    // --- Pd_max calculation (layer-by-layer up to critical depth)
    let depth = 0, maxPd = 0;
    const critical = parseFloat(pile.criticalDepth) || Infinity;
    for (let i = 0; i < updated.length; i++) {
      const γ = parseFloat(updated[i].unitWeight || 0);
      const h = parseFloat(updated[i].thickness || 0);
      const effGamma = Math.max(0, γ - 10); // prevent negative effective gamma
      if (depth + h <= critical) {
        maxPd += effGamma * h;
        depth += h;
      } else {
        const rem = critical - depth;
        if (rem > 0) {
          maxPd += effGamma * rem;
        }
        break;
      }
    }
    maxPd = +maxPd.toFixed(4);
    setMaxOverburden(maxPd);

    // --- Pd per layer (bottom of each layer)
    let cumDepth = 0;
    for (let i = 0; i < updated.length; i++) {
      const γ = parseFloat(updated[i].unitWeight || 0);
      const h = parseFloat(updated[i].thickness || 0);
      const effGamma = Math.max(0, γ - 10);

      if (i === 0) {
        const adjustedDepth = Math.max(0, cumDepth + h - parseFloat(pile.capThickness || 0) || 0);
        const pdVal = Math.min(effGamma * adjustedDepth, maxPd);
        updated[i].Pd = +pdVal.toFixed(4);
        cumDepth += h;
      } else {
        cumDepth += h;
        const PdRaw = effGamma * cumDepth;
        const pdVal = PdRaw > maxPd ? maxPd : PdRaw;
        updated[i].Pd = +pdVal.toFixed(4);
      }
    }

    // --- Pdi per layer (mid-depth of each layer)
    let sumDepth = 0;
    for (let i = 0; i < updated.length; i++) {
      const γ = parseFloat(updated[i].unitWeight || 0);
      const h = parseFloat(updated[i].thickness || 0);
      const effGamma = Math.max(0, γ - 10);

      if (i === 0) {
        const midDepth = sumDepth + h / 2 - parseFloat(pile.capThickness || 0);
        const adjustedMid = Math.max(0, midDepth);
        const pdiVal = Math.min(effGamma * adjustedMid, maxPd);
        updated[i].Pdi = +pdiVal.toFixed(4);
        sumDepth += h;
      } else {
        const midDepth = sumDepth + h / 2;
        const PdiRaw = effGamma * midDepth;
        const pdiVal = PdiRaw > maxPd ? maxPd : PdiRaw;
        updated[i].Pdi = +pdiVal.toFixed(4);
        sumDepth += h;
      }
    }

    // set updated layers (Pd and Pdi numeric)
    setLayers(updated);

    // --- NEW: totalDepth snapshot
    let depthSum = 0;
    // Sum all layers' thicknesses
    for (let i = 0; i < updated.length; i++) {
      depthSum += parseFloat(updated[i].thickness || 0);
    }
    setTotalDepth(updated.length > 0 ? +depthSum.toFixed(3) : 0);

    // --- NEW: Overburden at total depth (layer-by-layer up to critical depth)
    let obp = 0;
    let runningDepth = 0;
    for (let i = 0; i < updated.length; i++) {
      const γ = parseFloat(updated[i].unitWeight || 0);
      const h = parseFloat(updated[i].thickness || 0);
      const effGamma = Math.max(0, γ - 10);

      if (runningDepth + h <= critical) {
        obp += effGamma * h;
        runningDepth += h;
      } else {
        const rem = critical - runningDepth;
        if (rem > 0) obp += effGamma * rem;
        break;
      }
    }
    // cap by maxPd (should be same but ensure)
    if (obp > maxPd) obp = maxPd;
    setOverburdenAtDepth(+obp.toFixed(4));
  };

  const handleLayerChange = (index, key, value) => {
    updateLayer(index, key, value);
  };

  const calculateEndBearing = (index) => {
    const l = layers[index];
    const D = parseFloat(pile.diameter) || 0;
    const Ap = Math.PI * D * D / 4;
    const Pd = parseFloat(l.Pd || 0);
    const Cp = parseFloat(l.cohesion || 0);
    const γ = parseFloat(l.unitWeight || 0);
    const Ng = parseFloat(l.Ng || 0);
    const Nq = parseFloat(l.Nq || 0);
    const Nc = 9;
    // using numeric Ng, Nq; ensure units consistent
    const result = Ap * ((0.5 * D * γ * Ng) + (Pd * Nq) + (Nc * Cp));
    const updated = [...layers];
    updated[index].endBearing = +result.toFixed(3);
    setLayers(updated);
  };

  const calculateSkinFriction = (index) => {
    let total = 0;
    const updated = [...layers];
    for (let i = 0; i <= index; i++) {
      const l = updated[i];
      const Ki = parseFloat(l.Ki || 0);
      const Pdi = parseFloat(l.Pdi || 0);
      // delta must be in radians directly
      const delta = (!isNaN(l.phi) ? (parseFloat(l.phi) * Math.PI / 180) : 0);
      const α = parseFloat(l.alpha || 0);
      const Ci = parseFloat(l.cohesion || 0);
      const Asi = parseFloat(l.Asi || 0);
      const part = Ki * Pdi * Math.tan(delta) * Asi + α * Ci * Asi;
      total += part;
    }
    updated[index].skinFriction = +total.toFixed(3);
    setLayers(updated);
  };

  const capThicknessNum = parseFloat(pile.capThickness);
  const pileLengthNum = parseFloat(pile.length);
  const soilLayeringDepthM =
    pile.capThickness !== '' &&
    Number.isFinite(capThicknessNum) &&
    pile.length !== '' &&
    Number.isFinite(pileLengthNum)
      ? pileLengthNum - capThicknessNum
      : null;
  const showSoilLayeringHint =
    soilLayeringDepthM !== null && soilLayeringDepthM > 0;
  const showLayerDepthExceedsWarning =
    soilLayeringDepthM !== null &&
    layers.length > 0 &&
    totalDepth > soilLayeringDepthM + 1e-6;

  return (
    <>
      <Navbar />
      <Container>
        <Canvas>
          <Header>
            <Title>Pile Foundation Capacity</Title>
            <Subtitle>
              Capture pile geometry, soil layering, and derived parameters in a single canvas. Run friction and end-bearing checks with one click.
            </Subtitle>
            <TagList>
              <Tag>Axial design</Tag>
              <Tag>Skin friction</Tag>
              <Tag>End bearing</Tag>
            </TagList>
          </Header>

          <ContentGrid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SectionCard>
                <SectionTitle>
                  <h3>Project parameters</h3>
                  <p>Define pile geometry and critical depth assumptions.</p>
                </SectionTitle>
                <FormGroup>
                  <label>
                    Diameter (m)
                    <input name="diameter" type="number" value={pile.diameter} onChange={handlePileChange} placeholder="e.g. 0.6" />
                  </label>
                  <label>
                    Length (m)
                    <input name="length" type="number" value={pile.length} onChange={handlePileChange} placeholder="e.g. 30" />
                  </label>
                  <label>
                    Cap Thickness (m)
                    <input name="capThickness" type="number" value={pile.capThickness} onChange={handlePileChange} placeholder="e.g. 1.2" />
                  </label>
                  <label>
                    Critical Depth Factor
                    <select name="factor" value={pile.factor} onChange={handlePileChange}>
                      {[15, 16, 17, 18, 19, 20].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Critical Depth (m)
                    <input value={pile.criticalDepth} readOnly />
                  </label>
                </FormGroup>
                {showSoilLayeringHint && (
                  <Info style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                    Make layering of soil of {+soilLayeringDepthM.toFixed(3)} m as pile cap will be in soil layer only.
                  </Info>
                )}
              </SectionCard>

              <SectionCard>
                <SectionHeader>
                  <SectionTitle>
                    <h3>Soil layers</h3>
                    <p>Stay organised as you build the subsurface profile.</p>
                  </SectionTitle>
                  <AddLayerButton type="button" onClick={addLayer}>
                    + Add layer
                  </AddLayerButton>
                </SectionHeader>

                {showLayerDepthExceedsWarning && (
                  <Info
                    role="alert"
                    style={{
                      marginBottom: '1rem',
                      padding: '0.85rem 1rem',
                      background: 'rgba(251, 191, 36, 0.15)',
                      borderRadius: '16px',
                      border: '1px solid rgba(217, 119, 6, 0.45)',
                      color: '#92400e',
                      fontWeight: 600,
                    }}
                  >
                    Warning: total layer depth ({+totalDepth.toFixed(3)} m) must not exceed {+soilLayeringDepthM.toFixed(3)} m (pile length minus cap thickness). Reduce layer thicknesses accordingly.
                  </Info>
                )}

                {layers.length === 0 && (
                  <EmptyState>
                    No layers yet. Start by adding the uppermost stratum to unlock Pd and Asi tracking.
                  </EmptyState>
                )}

                {layers.map((layer, index) => {
                  const Ap = (Math.PI / 4 * (parseFloat(pile.diameter) || 0) * (parseFloat(pile.diameter) || 0)).toFixed(4);
                  const delta = layer.phi ? (parseFloat(layer.phi) * Math.PI / 180).toFixed(4) : 0;
                  const thicknessEntered =
                    layer.thickness !== '' && Number.isFinite(parseFloat(layer.thickness));
                  let depthNoteText = '';
                  if (thicknessEntered) {
                    if (index === 0) {
                      const t = parseFloat(layer.thickness);
                      depthNoteText = `Pile length below cap level is ${+t.toFixed(3)} m.`;
                    } else {
                      const cumBelowCap = cumulativeLayerDepthM(layers, index);
                      depthNoteText = `Pile length below cap level is ${+cumBelowCap.toFixed(3)} m (sum of layers above and this layer).`;
                    }
                  }

                  const cumDepthForSketch = cumulativeLayerDepthM(layers, index);
                  const showPileSketch =
                    pileVisualLayerIndex === index && thicknessEntered && cumDepthForSketch > 0;
                  const pileDiameterNum = parseFloat(pile.diameter) || 0;
                  const capThicknessSketch = parseFloat(pile.capThickness) || 0;

                  return (
                    <LayerContainer
                      key={`layer-${index}`}
                      role="presentation"
                      onClick={() => setPileVisualLayerIndex(index)}
                      style={{
                        cursor: 'pointer',
                        outline:
                          pileVisualLayerIndex === index
                            ? '2px solid rgba(99, 102, 241, 0.5)'
                            : undefined,
                        outlineOffset: 3,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <LayerTitle>Layer {index + 1}</LayerTitle>
                        <span style={{ color: '#6366f1', fontWeight: 600 }}>{layer.soil || 'Select soil type'}</span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          gap: '1.25rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                          <FormGroup>
                            <label>
                              Soil Type
                              <select value={layer.soil} onChange={(e) => handleLayerChange(index, 'soil', e.target.value)}>
                                <option value="">Select</option>
                                {soilTypes.map((t) => (
                                  <option key={t}>{t}</option>
                                ))}
                              </select>
                            </label>
                            <label>
                              Thickness (m)
                              <input type="number" value={layer.thickness} onChange={(e) => handleLayerChange(index, 'thickness', e.target.value)} />
                            </label>
                            <label>
                              γ (kN/m³)
                              <input type="number" value={layer.unitWeight} onChange={(e) => handleLayerChange(index, 'unitWeight', e.target.value)} />
                            </label>
                            <label>
                              ϕ (°)
                              <input type="number" value={layer.phi} onChange={(e) => handleLayerChange(index, 'phi', e.target.value)} />
                            </label>
                            <label>
                              C (kN/m²)
                              <input type="number" value={layer.cohesion} onChange={(e) => handleLayerChange(index, 'cohesion', e.target.value)} />
                            </label>
                          </FormGroup>
                        </div>
                        {showPileSketch && (
                          <PileCylinderVisual
                            profileLayers={layers.slice(0, index + 1)}
                            diameterM={pileDiameterNum}
                            capThicknessM={capThicknessSketch}
                          />
                        )}
                      </div>

                      {depthNoteText && (
                        <Info style={{ marginTop: '0.25rem', color: '#334155', fontWeight: 600 }}>
                          {depthNoteText}
                        </Info>
                      )}

                      <Info>Asi: {layer.Asi || '—'} • Nq: {layer.Nq || '—'} • Nγ: {layer.Ng || '—'} • Ki: {layer.Ki || '—'} • α: {layer.alpha || '—'}</Info>
                      <Info>Pd: {layer.Pd || '—'} • Pdi: {layer.Pdi || '—'}</Info>

                      <ButtonRow>
                        <Button type="button" onClick={() => calculateEndBearing(index)}>
                          End bearing
                        </Button>
                        <Button type="button" onClick={() => calculateSkinFriction(index)}>
                          Skin friction
                        </Button>
                      </ButtonRow>

                      {layer.endBearing !== null && (
                        <CalculationResult type="bearing">
                          <h4>End Bearing: {layer.endBearing} kN</h4>
                          <p>Recommended: {(layer.endBearing / 2.5).toFixed(2)} kN | Ap = {Ap} m²</p>
                        </CalculationResult>
                      )}
                      {layer.skinFriction !== null && (
                        <CalculationResult type="skin">
                          <h4>Skin Friction: {layer.skinFriction} kN</h4>
                          <p>Recommended: {(layer.skinFriction / 2.5).toFixed(2)} kN | δ = {delta} rad</p>
                        </CalculationResult>
                      )}
                    </LayerContainer>
                  );
                })}
              </SectionCard>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SectionCard>
                <SectionTitle>
                  <h3>Design snapshot</h3>
                  <p>Quickly reference derived values and depth checks.</p>
                </SectionTitle>
                <StatGrid>
                  <StatCard>
                    <h4>Critical depth</h4>
                    <span>{pile.criticalDepth ? `${pile.criticalDepth} m` : '—'}</span>
                  </StatCard>
                  <StatCard>
                    <h4>Pile length</h4>
                    <span>{pile.length ? `${pile.length} m` : '—'}</span>
                  </StatCard>
                  <StatCard>
                    <h4>Diameter</h4>
                    <span>{pile.diameter ? `${pile.diameter} m` : '—'}</span>
                  </StatCard>

                  {/* NEW Snapshot cards */}
                  <StatCard>
                    <h4>Total Layer Depth</h4>
                    <span>{totalDepth ? `${totalDepth} m` : '—'}</span>
                  </StatCard>

                  <StatCard>
                    <h4>Overburden at Depth</h4>
                    <span>{overburdenAtDepth ? `${overburdenAtDepth} kN/m²` : '—'}</span>
                  </StatCard>
                </StatGrid>
              </SectionCard>

              {maxOverburden > 0 && (
                <MaxOverburdenBox>
                  <h3>
                    Max Overburden Pressure (Pd
                    <sub>max</sub>)
                  </h3>
                  <p>
                    Pd<sub>max</sub> = <strong>{maxOverburden} kN/m²</strong> (evaluated to critical depth)
                  </p>
                </MaxOverburdenBox>
              )}
            </div>
          </ContentGrid>
        </Canvas>
      </Container>
    </>
  );
}
